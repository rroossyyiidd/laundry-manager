import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { perfumeSchema } from '@/lib/schemas'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const perfumeId = parseInt(id)

    if (isNaN(perfumeId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid perfume ID',
        },
        { status: 400 }
      )
    }

    const perfume = await prisma.perfume.findUnique({
      where: { id: perfumeId },
    })

    if (!perfume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Perfume not found',
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: perfume,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch perfume',
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
    const perfumeId = parseInt(id)

    if (isNaN(perfumeId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid perfume ID',
        },
        { status: 400 }
      )
    }

    const body = await request.json()
    
    // Validate the request body
    const validationResult = perfumeSchema.safeParse(body)
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

    const { name, description, available } = validationResult.data

    // Check if perfume exists
    const existingPerfume = await prisma.perfume.findUnique({
      where: { id: perfumeId },
    })

    if (!existingPerfume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Perfume not found',
        },
        { status: 404 }
      )
    }

    const updatedPerfume = await prisma.perfume.update({
      where: { id: perfumeId },
      data: {
        name,
        description,
        available,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPerfume,
      message: 'Perfume updated successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update perfume',
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
    const perfumeId = parseInt(id)

    if (isNaN(perfumeId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid perfume ID',
        },
        { status: 400 }
      )
    }

    // Check if perfume exists
    const existingPerfume = await prisma.perfume.findUnique({
      where: { id: perfumeId },
    })

    if (!existingPerfume) {
      return NextResponse.json(
        {
          success: false,
          error: 'Perfume not found',
        },
        { status: 404 }
      )
    }

    await prisma.perfume.delete({
      where: { id: perfumeId },
    })

    return NextResponse.json({
      success: true,
      message: 'Perfume deleted successfully',
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete perfume',
      },
      { status: 500 }
    )
  }
}
