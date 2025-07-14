import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { laundryOrderSchema } from '@/lib/schemas'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order ID',
        },
        { status: 400 }
      )
    }

    const order = await prisma.laundryOrder.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        package: true,
        paymentMethod: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: order,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch order',
      },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order ID',
        },
        { status: 400 }
      )
    }

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

    const { customerId, packageId, weight, status, paymentMethodId, notes } = validationResult.data

    // Check if order exists
    const existingOrder = await prisma.laundryOrder.findUnique({
      where: { id: orderId },
    })

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    // Calculate total amount if package or weight changed
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

    const updatedOrder = await prisma.laundryOrder.update({
      where: { id: orderId },
      data: {
        customerId,
        packageId,
        weight,
        status,
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

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Order updated successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update order',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const orderId = parseInt(id)

    if (isNaN(orderId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid order ID',
        },
        { status: 400 }
      )
    }

    // Check if order exists
    const existingOrder = await prisma.laundryOrder.findUnique({
      where: { id: orderId },
    })

    if (!existingOrder) {
      return NextResponse.json(
        {
          success: false,
          error: 'Order not found',
        },
        { status: 404 }
      )
    }

    await prisma.laundryOrder.delete({
      where: { id: orderId },
    })

    return NextResponse.json({
      success: true,
      message: 'Order deleted successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete order',
      },
      { status: 500 }
    )
  }
}
