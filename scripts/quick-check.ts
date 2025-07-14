import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function quickCheck() {
  try {
    // Quick database status
    const counts = await Promise.all([
      prisma.customer.count(),
      prisma.package.count(), 
      prisma.paymentMethod.count(),
      prisma.laundryOrder.count()
    ])

    console.log('📊 Database Status:')
    console.log(`✅ Customers: ${counts[0]}`)
    console.log(`✅ Packages: ${counts[1]}`) 
    console.log(`✅ Payment Methods: ${counts[2]}`)
    console.log(`✅ Orders: ${counts[3]}`)
    
    if (counts.every(count => count > 0)) {
      console.log('\n🎉 Database dan seeder berfungsi dengan baik!')
    } else {
      console.log('\n⚠️ Beberapa tabel masih kosong. Jalankan: npm run db:seed')
    }

  } catch (error) {
    console.error('❌ Database error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

quickCheck()
