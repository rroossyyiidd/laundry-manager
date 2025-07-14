import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { packageSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      include: {
        orders: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 5, // Latest 5 orders per package
        },
      },
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: packages,
      count: packages.length,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch packages',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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

    // Check if package name already exists
    const existingPackage = await prisma.package.findFirst({
      where: { name },
    })

    if (existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package with this name already exists',
        },
        { status: 409 }
      )
    }

    const packageData = await prisma.package.create({
      data: {
        name,
        description,
        price: price || null,
        active,
      },
    })

    return NextResponse.json({
      success: true,
      data: packageData,
      message: 'Package created successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create package',
      },
      { status: 500 }
    )
  }
}
