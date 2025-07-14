import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create sample payment methods
  const cashPayment = await prisma.paymentMethod.create({
    data: {
      name: 'Cash',
      description: 'Cash payment',
      active: true,
    },
  })

  const cardPayment = await prisma.paymentMethod.create({
    data: {
      name: 'Credit Card',
      description: 'Credit card payment',
      active: true,
    },
  })

  const digitalPayment = await prisma.paymentMethod.create({
    data: {
      name: 'Digital Wallet',
      description: 'Digital wallet payment (GoPay, OVO, etc.)',
      active: true,
    },
  })

  // Create sample packages
  const basicPackage = await prisma.package.create({
    data: {
      name: 'Basic Wash',
      description: 'Standard washing and drying service',
      price: 15000,
      active: true,
    },
  })

  const premiumPackage = await prisma.package.create({
    data: {
      name: 'Premium Wash',
      description: 'Premium washing with fabric conditioner and folding',
      price: 25000,
      active: true,
    },
  })

  const expressPackage = await prisma.package.create({
    data: {
      name: 'Express Service',
      description: 'Same-day express laundry service',
      price: 35000,
      active: true,
    },
  })

  // Create sample customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+628123456789',
      address: 'Jl. Sudirman No. 123, Jakarta',
    },
  })

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '+628987654321',
      address: 'Jl. Thamrin No. 456, Jakarta',
    },
  })

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Bob Wilson',
      email: 'bob.wilson@example.com',
      phone: '+628555666777',
      address: 'Jl. Gatot Subroto No. 789, Jakarta',
    },
  })

  // Create sample orders
  await prisma.laundryOrder.create({
    data: {
      customerId: customer1.id,
      packageId: basicPackage.id,
      weight: 2.5,
      status: 'Processing',
      totalAmount: 37500, // 2.5kg * 15000
      paymentMethodId: cashPayment.id,
      paymentStatus: 'Paid',
      notes: 'Please wash gently',
    },
  })

  await prisma.laundryOrder.create({
    data: {
      customerId: customer2.id,
      packageId: premiumPackage.id,
      weight: 3.0,
      status: 'Pending',
      totalAmount: 75000, // 3.0kg * 25000
      paymentMethodId: cardPayment.id,
      paymentStatus: 'Pending',
    },
  })

  await prisma.laundryOrder.create({
    data: {
      customerId: customer3.id,
      packageId: expressPackage.id,
      weight: 1.5,
      status: 'Completed',
      totalAmount: 52500, // 1.5kg * 35000
      paymentMethodId: digitalPayment.id,
      paymentStatus: 'Paid',
      notes: 'Delivered on time',
    },
  })

  console.log('Database has been seeded successfully!')
  console.log('Created:')
  console.log('- 3 Payment Methods')
  console.log('- 3 Packages')
  console.log('- 3 Customers')
  console.log('- 3 Laundry Orders')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
