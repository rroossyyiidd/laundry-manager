import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { perfumeSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const perfumes = await prisma.perfume.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: perfumes,
      count: perfumes.length,
    })
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch perfumes',
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
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

    const perfume = await prisma.perfume.create({
      data: {
        name,
        description,
        available,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: perfume,
        message: 'Perfume created successfully',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Database error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create perfume',
      },
      { status: 500 }
    )
  }
}
