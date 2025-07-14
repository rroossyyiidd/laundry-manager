import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabase() {
  try {
    console.log('🔍 Checking database...\n')

    // Count records
    const counts = await Promise.all([
      prisma.customer.count(),
      prisma.package.count(),
      prisma.paymentMethod.count(),
      prisma.laundryOrder.count(),
    ])

    console.log('📊 Record counts:')
    console.log(`- Customers: ${counts[0]}`)
    console.log(`- Packages: ${counts[1]}`)
    console.log(`- Payment Methods: ${counts[2]}`)
    console.log(`- Laundry Orders: ${counts[3]}`)
    console.log()

    // Show sample data
    const orders = await prisma.laundryOrder.findMany({
      include: {
        customer: true,
        package: true,
        paymentMethod: true,
      },
      take: 3,
    })

    console.log('📦 Sample Orders:')
    orders.forEach((order, index) => {
      console.log(`${index + 1}. Order #${order.id}`)
      console.log(`   Customer: ${order.customer.name}`)
      console.log(`   Package: ${order.package.name}`)
      console.log(`   Weight: ${order.weight}kg`)
      console.log(`   Status: ${order.status}`)
      console.log(`   Payment: ${order.paymentMethod?.name || 'N/A'}`)
      console.log(`   Total: Rp ${order.totalAmount?.toLocaleString('id-ID') || '0'}`)
      console.log()
    })

    console.log('✅ Database verification completed!')

  } catch (error) {
    console.error('❌ Database check failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()
