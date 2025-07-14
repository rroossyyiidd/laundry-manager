import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { customerSchema } from '@/lib/schemas'

type Params = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const customerId = parseInt(resolvedParams.id)
    
    if (isNaN(customerId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid customer ID',
        },
        { status: 400 }
      )
    }

    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: {
          include: {
            package: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!customer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: customer,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch customer',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const customerId = parseInt(resolvedParams.id)
    
    if (isNaN(customerId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid customer ID',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = customerSchema.safeParse(body)
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

    const { name, email, phone } = validationResult.data

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
    })

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer not found',
        },
        { status: 404 }
      )
    }

    // Check if email is already taken by another customer
    if (email !== existingCustomer.email) {
      const emailExists = await prisma.customer.findUnique({
        where: { email },
      })

      if (emailExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Email is already taken by another customer',
          },
          { status: 409 }
        )
      }
    }

    const updatedCustomer = await prisma.customer.update({
      where: { id: customerId },
      data: {
        name,
        email,
        phone,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedCustomer,
      message: 'Customer updated successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email is already taken by another customer',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update customer',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const customerId = parseInt(resolvedParams.id)
    
    if (isNaN(customerId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid customer ID',
        },
        { status: 400 }
      )
    }

    // Check if customer exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { id: customerId },
      include: {
        orders: true,
      },
    })

    if (!existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer not found',
        },
        { status: 404 }
      )
    }

    // Check if customer has orders
    if (existingCustomer.orders.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete customer with existing orders. Please delete or reassign orders first.',
        },
        { status: 400 }
      )
    }

    await prisma.customer.delete({
      where: { id: customerId },
    })

    return NextResponse.json({
      success: true,
      message: 'Customer deleted successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete customer',
      },
      { status: 500 }
    )
  }
}
