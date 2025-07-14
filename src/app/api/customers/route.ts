import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { customerSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const customers = await prisma.customer.findMany({
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Latest 5 orders per customer
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: customers,
      count: customers.length,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch customers',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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

    // Check if email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email },
    })

    if (existingCustomer) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer with this email already exists',
        },
        { status: 409 }
      )
    }

    const customer = await prisma.customer.create({
      data: {
        name,
        email,
        phone,
      },
    })

    return NextResponse.json({
      success: true,
      data: customer,
      message: 'Customer created successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Customer with this email already exists',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create customer',
      },
      { status: 500 }
    )
  }
}
