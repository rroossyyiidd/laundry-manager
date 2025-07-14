import { prisma } from '../src/lib/prisma'

async function testDatabaseIntegration() {
  console.log('🧪 Testing database integration...\n')

  try {
    // Test 1: Fetch all orders with relations
    console.log('1️⃣ Testing order queries with relations...')
    const orders = await prisma.laundryOrder.findMany({
      include: {
        customer: true,
        package: true,
        paymentMethod: true,
      },
    })
    console.log(`✅ Found ${orders.length} orders with full relations`)

    // Test 2: Create a new customer
    console.log('\n2️⃣ Testing customer creation...')
    const newCustomer = await prisma.customer.create({
      data: {
        name: 'Test Customer',
        email: 'test@example.com',
        phone: '+628999888777',
        address: 'Test Address 123',
      },
    })
    console.log(`✅ Created customer: ${newCustomer.name} (ID: ${newCustomer.id})`)

    // Test 3: Create a new order
    console.log('\n3️⃣ Testing order creation...')
    const firstPackage = await prisma.package.findFirst()
    if (firstPackage) {
      const newOrder = await prisma.laundryOrder.create({
        data: {
          customerId: newCustomer.id,
          packageId: firstPackage.id,
          weight: 2.0,
          totalAmount: firstPackage.price ? firstPackage.price * 2.0 : null,
          notes: 'Test order from integration test',
        },
        include: {
          customer: true,
          package: true,
        },
      })
      console.log(`✅ Created order: #${newOrder.id} for ${newOrder.customer.name}`)
    }

    // Test 4: Query with complex filters
    console.log('\n4️⃣ Testing complex queries...')
    const pendingOrders = await prisma.laundryOrder.findMany({
      where: {
        status: 'Pending',
        weight: {
          gte: 2.0,
        },
      },
      include: {
        customer: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    })
    console.log(`✅ Found ${pendingOrders.length} pending orders with weight >= 2.0kg`)

    // Test 5: Aggregation
    console.log('\n5️⃣ Testing aggregations...')
    const stats = await prisma.laundryOrder.aggregate({
      _count: {
        id: true,
      },
      _sum: {
        totalAmount: true,
        weight: true,
      },
      _avg: {
        weight: true,
      },
    })
    console.log('✅ Order statistics:')
    console.log(`   Total orders: ${stats._count.id}`)
    console.log(`   Total revenue: Rp ${stats._sum.totalAmount?.toLocaleString('id-ID') || '0'}`)
    console.log(`   Total weight: ${stats._sum.weight || 0}kg`)
    console.log(`   Average weight: ${stats._avg.weight?.toFixed(2) || 0}kg`)

    // Clean up test data
    console.log('\n🧹 Cleaning up test data...')
    await prisma.laundryOrder.deleteMany({
      where: {
        customerId: newCustomer.id,
      },
    })
    await prisma.customer.delete({
      where: {
        id: newCustomer.id,
      },
    })
    console.log('✅ Test data cleaned up')

    console.log('\n🎉 All database integration tests passed!')

  } catch (error) {
    console.error('❌ Database integration test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testDatabaseIntegration()
