import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paymentMethodSchema } from '@/lib/schemas'

type Params = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const paymentMethodId = parseInt(resolvedParams.id)
    
    if (isNaN(paymentMethodId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment method ID',
        },
        { status: 400 }
      )
    }

    const paymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      include: {
        orders: {
          include: {
            customer: true,
            package: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!paymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment method not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: paymentMethod,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch payment method',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const paymentMethodId = parseInt(resolvedParams.id)
    
    if (isNaN(paymentMethodId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment method ID',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = paymentMethodSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const { name, description, active } = validationResult.data

    // Check if payment method exists
    const existingPaymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
    })

    if (!existingPaymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment method not found',
        },
        { status: 404 }
      )
    }

    // Check if name is already taken by another payment method
    if (name !== existingPaymentMethod.name) {
      const nameExists = await prisma.paymentMethod.findFirst({
        where: { 
          name,
          id: { not: paymentMethodId }
        },
      })

      if (nameExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Payment method name is already taken by another method',
          },
          { status: 409 }
        )
      }
    }

    const updatedPaymentMethod = await prisma.paymentMethod.update({
      where: { id: paymentMethodId },
      data: {
        name,
        description,
        active,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPaymentMethod,
      message: 'Payment method updated successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment method name is already taken by another method',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update payment method',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const paymentMethodId = parseInt(resolvedParams.id)
    
    if (isNaN(paymentMethodId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid payment method ID',
        },
        { status: 400 }
      )
    }

    // Check if payment method exists
    const existingPaymentMethod = await prisma.paymentMethod.findUnique({
      where: { id: paymentMethodId },
      include: {
        orders: true,
      },
    })

    if (!existingPaymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment method not found',
        },
        { status: 404 }
      )
    }

    // Check if payment method has orders
    if (existingPaymentMethod.orders.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete payment method with existing orders. Please delete or reassign orders first.',
        },
        { status: 400 }
      )
    }

    await prisma.paymentMethod.delete({
      where: { id: paymentMethodId },
    })

    return NextResponse.json({
      success: true,
      message: 'Payment method deleted successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete payment method',
      },
      { status: 500 }
    )
  }
}
