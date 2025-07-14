import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { paymentMethodSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const paymentMethods = await prisma.paymentMethod.findMany({
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Latest 5 orders per payment method
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: paymentMethods,
      count: paymentMethods.length,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch payment methods',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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

    // Check if payment method name already exists
    const existingPaymentMethod = await prisma.paymentMethod.findFirst({
      where: { name },
    })

    if (existingPaymentMethod) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment method with this name already exists',
        },
        { status: 409 }
      )
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data: {
        name,
        description,
        active,
      },
    })

    return NextResponse.json({
      success: true,
      data: paymentMethod,
      message: 'Payment method created successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Payment method with this name already exists',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create payment method',
      },
      { status: 500 }
    )
  }
}
