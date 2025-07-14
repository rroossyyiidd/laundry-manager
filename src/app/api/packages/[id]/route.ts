import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { packageSchema } from '@/lib/schemas'

type Params = {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const packageId = parseInt(resolvedParams.id)
    
    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid package ID',
        },
        { status: 400 }
      )
    }

    const packageData = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        orders: {
          include: {
            customer: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    })

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: packageData,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch package',
      },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const packageId = parseInt(resolvedParams.id)
    
    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid package ID',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = packageSchema.safeParse(body)
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

    const { name, description, active, price } = validationResult.data

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
    })

    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
        },
        { status: 404 }
      )
    }

    // Check if name is already taken by another package
    if (name !== existingPackage.name) {
      const nameExists = await prisma.package.findFirst({
        where: { 
          name,
          id: { not: packageId }
        },
      })

      if (nameExists) {
        return NextResponse.json(
          {
            success: false,
            error: 'Package name is already taken by another package',
          },
          { status: 409 }
        )
      }
    }

    const updatedPackage = await prisma.package.update({
      where: { id: packageId },
      data: {
        name,
        description,
        price: price || null,
        active,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPackage,
      message: 'Package updated successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    
    // Handle unique constraint violation
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package name is already taken by another package',
        },
        { status: 409 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update package',
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const resolvedParams = await params
    const packageId = parseInt(resolvedParams.id)
    
    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid package ID',
        },
        { status: 400 }
      )
    }

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: { id: packageId },
      include: {
        orders: true,
      },
    })

    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
        },
        { status: 404 }
      )
    }

    // Check if package has orders
    if (existingPackage.orders.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete package with existing orders. Please delete or reassign orders first.',
        },
        { status: 400 }
      )
    }

    await prisma.package.delete({
      where: { id: packageId },
    })

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete package',
      },
      { status: 500 }
    )
  }
}
