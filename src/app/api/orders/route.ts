import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { laundryOrderSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const orders = await prisma.laundryOrder.findMany({
      include: {
        customer: true,
        package: true,
        paymentMethod: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch orders',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate the request body
    const validationResult = laundryOrderSchema.safeParse(body)
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

    const { customerId, packageId, weight, paymentMethodId, notes } = validationResult.data

    // Calculate total amount based on package price and weight
    const selectedPackage = await prisma.package.findUnique({
      where: { id: packageId },
    })

    if (!selectedPackage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
        },
        { status: 404 }
      )
    }

    const totalAmount = selectedPackage.price ? selectedPackage.price * weight : null

    const order = await prisma.laundryOrder.create({
      data: {
        customerId,
        packageId,
        weight,
        paymentMethodId,
        totalAmount,
        notes,
      },
      include: {
        customer: true,
        package: true,
        paymentMethod: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: 'Laundry order created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create order',
      },
      { status: 500 }
    )
  }
}
