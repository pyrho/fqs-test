// Mostly generated via claude.ai
import { PrismaClient, PlanTier, Recurrence } from '@prisma/client'
import { randomUUID } from 'crypto'

const prisma = new PrismaClient()

// Helper function to get random date between two dates
function randomDate(start: Date, end: Date) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
}

// Generate sequence of dates for recurring subscriptions
function generateSubscriptionDates(
  startDate: Date,
  recurrence: Recurrence,
  numOccurrences: number,
) {
  const dates = []
  let currentDate = new Date(startDate)

  for (let i = 0; i < numOccurrences; i++) {
    const endDate = new Date(currentDate)

    switch (recurrence) {
      case 'MONTHLY':
        endDate.setMonth(endDate.getMonth() + 1)
        break
      case 'THREE_MONTHS':
        endDate.setMonth(endDate.getMonth() + 3)
        break
      case 'YEARLY':
        endDate.setFullYear(endDate.getFullYear() + 1)
        break
    }

    dates.push({
      startDate: new Date(currentDate),
      endDate: new Date(endDate),
    })

    currentDate = new Date(endDate)
  }

  return dates
}

// Function to generate company names
function generateCompanyName() {
  const prefixes = [
    'Tech',
    'Data',
    'Cloud',
    'Cyber',
    'AI',
    'Smart',
    'Digital',
    'Quantum',
    'Net',
    'Web',
    'App',
    'Dev',
    'Soft',
    'Logic',
    'System',
    'Meta',
    'Micro',
    'Macro',
    'Global',
    'Local',
    'Fast',
    'Quick',
    'Rapid',
    'Swift',
    'Agile',
    'Nimble',
    'Dynamic',
    'Active',
    'Pro',
    'Elite',
  ]

  const roots = [
    'Solutions',
    'Systems',
    'Technologies',
    'Innovations',
    'Applications',
    'Networks',
    'Services',
    'Platforms',
    'Analytics',
    'Computing',
    'Software',
    'Hardware',
    'Dynamics',
    'Logic',
    'Methods',
    'Labs',
    'Works',
    'Forge',
    'Hub',
    'Base',
    'Core',
    'Mind',
    'Brain',
    'Think',
    'Code',
    'Stack',
    'Flow',
    'Stream',
    'Chain',
    'Link',
    'Node',
    'Point',
    'Space',
    'Sphere',
    'Box',
  ]

  const suffixes = [
    'Corp',
    'Inc',
    'Ltd',
    'Group',
    'Team',
    'Co',
    'Industries',
    'International',
    'Global',
    'Worldwide',
    'Partners',
    'Associates',
    'Company',
    'Enterprise',
    'Ventures',
    'Labs',
    'Research',
    'Works',
    'Solutions',
    'Services',
    'Systems',
    'Tech',
    'Digital',
    'Connect',
    'Direct',
  ]

  // Add some randomization to the pattern
  if (Math.random() < 0.3) {
    // Single word name with suffix
    return `${roots[Math.floor(Math.random() * roots.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
  } else if (Math.random() < 0.6) {
    // Prefix + Root
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${roots[Math.floor(Math.random() * roots.length)]}`
  } else {
    // Full three-part name
    return `${prefixes[Math.floor(Math.random() * prefixes.length)]}${roots[Math.floor(Math.random() * roots.length)]} ${suffixes[Math.floor(Math.random() * suffixes.length)]}`
  }
}

async function generateMockData() {
  // Clear existing data
  await prisma.$transaction([
    prisma.refund.deleteMany(),
    prisma.payment.deleteMany(),
    prisma.paymentMethod.deleteMany(),
    prisma.discount.deleteMany(),
    prisma.subscription.deleteMany(),
    prisma.plan.deleteMany(),
    prisma.user.deleteMany(),
    prisma.team.deleteMany(),
  ])

  // Create plans
  const plans = await Promise.all([
    // Basic plans
    prisma.plan.create({ data: { tier: 'BASIC', price_cts: 999, recurrence: 'MONTHLY' } }),
    prisma.plan.create({ data: { tier: 'BASIC', price_cts: 2697, recurrence: 'THREE_MONTHS' } }),
    prisma.plan.create({ data: { tier: 'BASIC', price_cts: 9990, recurrence: 'YEARLY' } }),
    // Premium plans
    prisma.plan.create({ data: { tier: 'PREMIUM', price_cts: 1999, recurrence: 'MONTHLY' } }),
    prisma.plan.create({ data: { tier: 'PREMIUM', price_cts: 5397, recurrence: 'THREE_MONTHS' } }),
    prisma.plan.create({ data: { tier: 'PREMIUM', price_cts: 19990, recurrence: 'YEARLY' } }),
    // Pro plans
    prisma.plan.create({ data: { tier: 'PRO', price_cts: 4999, recurrence: 'MONTHLY' } }),
    prisma.plan.create({ data: { tier: 'PRO', price_cts: 13497, recurrence: 'THREE_MONTHS' } }),
    prisma.plan.create({ data: { tier: 'PRO', price_cts: 49990, recurrence: 'YEARLY' } }),
    // Enterprise plans
    prisma.plan.create({ data: { tier: 'ENTERPRISE', price_cts: 9999, recurrence: 'MONTHLY' } }),
    prisma.plan.create({
      data: { tier: 'ENTERPRISE', price_cts: 26997, recurrence: 'THREE_MONTHS' },
    }),
    prisma.plan.create({ data: { tier: 'ENTERPRISE', price_cts: 99990, recurrence: 'YEARLY' } }),
    // Student plans
    prisma.plan.create({ data: { tier: 'STUDENT', price_cts: 499, recurrence: 'MONTHLY' } }),
    prisma.plan.create({ data: { tier: 'STUDENT', price_cts: 1347, recurrence: 'THREE_MONTHS' } }),
    prisma.plan.create({ data: { tier: 'STUDENT', price_cts: 4990, recurrence: 'YEARLY' } }),
  ])

  const plansByTier = plans.reduce(
    (acc, plan) => {
      if (!acc[plan.tier]) acc[plan.tier] = [] as any
      acc[plan.tier].push(plan)
      return acc
    },
    {} as Record<PlanTier, typeof plans>,
  )

  const startDate = new Date('2023-01-01')
  const today = new Date()

  // Create teams with users and payment methods first
  for (let i = 0; i < 2000; i++) {
    if (i % 100 === 0) {
      console.log(`Creating team ${i}/2000...`)
    }

    const teamType = Math.random()
    const teamTiers =
      teamType < 0.3
        ? (['BASIC', 'PREMIUM'] as PlanTier[])
        : teamType < 0.6
          ? (['PREMIUM', 'PRO'] as PlanTier[])
          : teamType < 0.8
            ? (['PRO', 'ENTERPRISE'] as PlanTier[])
            : (['STUDENT', 'BASIC'] as PlanTier[])

    const companyName = generateCompanyName()
    const teamCreationDate = randomDate(startDate, today)

    // Create team with initial data
    const team = await prisma.team.create({
      data: {
        name: companyName,
        automatic_renewal: Math.random() > 0.2,
        created_at: teamCreationDate,
        users: {
          create: Array.from({ length: Math.floor(Math.random() * 8) + 3 }, (_, j) => ({
            email: `user${j + 1}_team${i + 1}_${randomUUID().split('-')[0]}@${companyName.toLowerCase().replace(/[^a-zA-Z0-9]/g, '')}.com`,
            role: j === 0 ? 'ADMIN' : 'USER',
            created_at: teamCreationDate,
            updated_at: teamCreationDate,
          })),
        },
        payment_methods: {
          create: Array.from({ length: Math.floor(Math.random() * 2) + 1 }, () => ({
            payment_data_hash: randomUUID(),
            created_at: teamCreationDate,
          })),
        },
      },
      include: {
        payment_methods: true,
      },
    })

    // For each team, create 1-3 subscription sequences
    const numSubscriptionSequences = Math.floor(Math.random() * 2) + 1

    for (let j = 0; j < numSubscriptionSequences; j++) {
      const tier = teamTiers[Math.floor(Math.random() * teamTiers.length)]
      const plan = plansByTier[tier][Math.floor(Math.random() * plansByTier[tier].length)]

      // Calculate number of renewals based on plan recurrence
      let monthsSinceStart =
        (today.getTime() - teamCreationDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
      const renewalPeriods = {
        MONTHLY: 1,
        THREE_MONTHS: 3,
        YEARLY: 12,
      }
      const maxRenewals = Math.floor(monthsSinceStart / renewalPeriods[plan.recurrence])
      const actualRenewals = Math.max(1, Math.floor(Math.random() * maxRenewals))

      // Generate subscription dates
      const subscriptionDates = generateSubscriptionDates(
        teamCreationDate,
        plan.recurrence,
        actualRenewals,
      )

      // Create subscriptions and payments for each period
      for (const [index, dates] of subscriptionDates.entries()) {
        const subscription = await prisma.subscription.create({
          data: {
            team_id: team.id,
            plan_id: plan.id,
            start_date: dates.startDate,
            end_date: dates.endDate,
            created_at: dates.startDate,
            cancelled_at:
              index === subscriptionDates.length - 1 && Math.random() < 0.1
                ? new Date(dates.startDate.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000)
                : null,
            upgraded_at:
              index === subscriptionDates.length - 1 && Math.random() < 0.05
                ? new Date(dates.startDate.getTime() + Math.random() * 15 * 24 * 60 * 60 * 1000)
                : null,
            refundable: Math.random() < 0.2,
          },
        })

        // Create payment
        const payment = await prisma.payment.create({
          data: {
            subscription_id: subscription.id,
            amount_cts: plan.price_cts,
            transaction_id: `txn_${randomUUID()}`,
            payment_method_id: team.payment_methods[0].id,
            created_at: dates.startDate,
          },
        })

        // Maybe create discount
        if (Math.random() < 0.2) {
          await prisma.discount.create({
            data: {
              subscription_id: subscription.id,
              amount_cts: Math.floor(plan.price_cts * 0.2),
              created_at: dates.startDate,
            },
          })
        }

        // Maybe create refund
        if (Math.random() < 0.05) {
          await prisma.refund.create({
            data: {
              payment_id: payment.id,
              transaction_id: `ref_${randomUUID()}`,
              amounts_cts: Math.floor(payment.amount_cts * 0.8),
              created_at: new Date(dates.startDate.getTime() + 24 * 60 * 60 * 1000), // 1 day after payment
            },
          })
        }
      }
    }
  }

  console.log('Created 2000 teams with historical subscription data from 2023 to present')
}

generateMockData()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
