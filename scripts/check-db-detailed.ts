import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function checkDatabaseStatus() {
  console.log('🔍 Mengecek Status Database Laundry Manager\n')
  console.log('='.repeat(50))

  try {
    // 1. Cek koneksi database
    console.log('1️⃣ Testing Database Connection...')
    await prisma.$connect()
    console.log('✅ Database terhubung dengan sukses!')

    // 2. Cek semua tabel dan jumlah data
    console.log('\n2️⃣ Checking Tables and Data Count...')
    
    const tableStats = await Promise.all([
      prisma.user.count(),
      prisma.customer.count(),
      prisma.package.count(),
      prisma.paymentMethod.count(),
      prisma.laundryOrder.count(),
      prisma.orderStatusHistory.count(),
      prisma.orderItem.count(),
      prisma.customerAddress.count(),
    ])

    const tables = [
      { name: 'Users', count: tableStats[0] },
      { name: 'Customers', count: tableStats[1] },
      { name: 'Packages', count: tableStats[2] },
      { name: 'Payment Methods', count: tableStats[3] },
      { name: 'Laundry Orders', count: tableStats[4] },
      { name: 'Order Status History', count: tableStats[5] },
      { name: 'Order Items', count: tableStats[6] },
      { name: 'Customer Addresses', count: tableStats[7] },
    ]

    tables.forEach(table => {
      const status = table.count > 0 ? '✅' : '⚠️'
      console.log(`${status} ${table.name}: ${table.count} records`)
    })

    // 3. Cek detail data seeder
    console.log('\n3️⃣ Checking Seeded Data Details...')
    
    // Customers
    const customers = await prisma.customer.findMany({
      orderBy: { id: 'asc' }
    })
    console.log('\n👥 Customers:')
    customers.forEach((customer, index) => {
      console.log(`   ${index + 1}. ${customer.name} - ${customer.email} (${customer.phone})`)
    })

    // Packages
    const packages = await prisma.package.findMany({
      orderBy: { id: 'asc' }
    })
    console.log('\n📦 Packages:')
    packages.forEach((pkg, index) => {
      const price = pkg.price ? `Rp ${pkg.price.toLocaleString('id-ID')}` : 'No price'
      console.log(`   ${index + 1}. ${pkg.name} - ${price}/kg`)
      console.log(`      ${pkg.description}`)
    })

    // Payment Methods
    const paymentMethods = await prisma.paymentMethod.findMany({
      orderBy: { id: 'asc' }
    })
    console.log('\n💳 Payment Methods:')
    paymentMethods.forEach((method, index) => {
      console.log(`   ${index + 1}. ${method.name} - ${method.description}`)
    })

    // Orders with details
    const orders = await prisma.laundryOrder.findMany({
      include: {
        customer: true,
        package: true,
        paymentMethod: true,
      },
      orderBy: { id: 'asc' }
    })
    console.log('\n🛒 Orders:')
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. Order #${order.id}`)
      console.log(`      Customer: ${order.customer.name}`)
      console.log(`      Package: ${order.package.name}`)
      console.log(`      Weight: ${order.weight}kg`)
      console.log(`      Status: ${order.status}`)
      console.log(`      Payment: ${order.paymentMethod?.name || 'No payment method'}`)
      console.log(`      Total: Rp ${order.totalAmount?.toLocaleString('id-ID') || '0'}`)
      console.log(`      Date: ${order.orderDate.toLocaleDateString('id-ID')}`)
      if (order.notes) console.log(`      Notes: ${order.notes}`)
      console.log()
    })

    // 4. Summary
    const totalRevenue = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    const totalWeight = orders.reduce((sum, order) => sum + order.weight, 0)

    console.log('📊 Summary Statistics:')
    console.log(`   Total Customers: ${customers.length}`)
    console.log(`   Total Orders: ${orders.length}`)
    console.log(`   Total Revenue: Rp ${totalRevenue.toLocaleString('id-ID')}`)
    console.log(`   Total Weight Processed: ${totalWeight}kg`)
    console.log(`   Average Order Value: Rp ${Math.round(totalRevenue / orders.length).toLocaleString('id-ID')}`)

    console.log('\n🎉 Database berhasil di-setup dan data seeder sudah diimport!')

  } catch (error) {
    console.error('❌ Error checking database:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
    }
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabaseStatus()
