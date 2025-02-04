import { readFile } from 'fs/promises'
import { add } from 'date-fns'
import { PlanTier, PrismaClient, Recurrence, Role } from '@prisma/client'
import { OldUser, Plans } from './types'
import { match } from 'ts-pattern'

const prisma = new PrismaClient()

function stringToPlanTier(stringTier: string, opts?: { legacyPlans: boolean }): PlanTier {
  return match(stringTier)
    .with('Basic', () => (opts?.legacyPlans ? PlanTier.LEGACY_BASIC : PlanTier.BASIC))
    .with('Premium', () => (opts?.legacyPlans ? PlanTier.LEGACY_PREMIUM : PlanTier.PREMIUM))
    .with('Pro', () => (opts?.legacyPlans ? PlanTier.LEGACY_PRO : PlanTier.PRO))
    .with('Enterprise', () =>
      opts?.legacyPlans ? PlanTier.LEGACY_ENTERPRISE : PlanTier.ENTERPRISE,
    )
    .with('Student', () => (opts?.legacyPlans ? PlanTier.LEGACY_STUDENT : PlanTier.STUDENT))
    .otherwise(() => {
      console.error(`Unexpected plan tier ${stringTier}`)
      process.exit(1)
    })
}

async function importPlans() {
  const plansFile = await readFile('./data/plans.json', 'utf8')
  let plans = [] as Plans[]
  try {
    plans = JSON.parse(plansFile)
  } catch (e) {
    console.error('Cannot parse plans dataset')
    console.error(e)
  }

  await prisma.plan.createMany({
    data: plans.map((plan) => ({
      tier: stringToPlanTier(plan.plan_name),
      price_cts: plan.default_amount_cts,
      recurrence: Recurrence.MONTHLY,
    })),
  })
}

async function importUsers() {
  const usersFile = await readFile('./data/users.json', 'utf8')
  let users = [] as OldUser[]
  try {
    users = JSON.parse(usersFile)
  } catch (e) {
    console.error('Cannot parse user dataset')
    console.error(e)
  }

  await Promise.all(
    users.map((user) =>
      prisma.team.create({
        data: {
          name: user.email,

          // Not having any payment methods stored, all migrated subscriptions
          // will not auto_renew.
          automatic_renewal: false,
          users: {
            create: {
              email: user.email,
              role: Role.ADMIN,
            },
          },
          subscriptions: {
            create: {
              start_date: new Date(user.start_date),
              end_date: user.ends_at
                ? new Date(user.ends_at)
                : add(new Date(user.start_date), { days: 30 }),
              plan: {
                create: {
                  tier: stringToPlanTier(user.sub_plan, { legacyPlans: true }),
                  price_cts: user.mthly_price,
                  recurrence: Recurrence.MONTHLY,
                },
              },
            },
          },
        },
      }),
    ),
  )
}

async function main() {
  await importUsers()
  await importPlans()
}

main()
  .then(async () => {
    console.log('Import done.')
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    await prisma.$disconnect()
    console.error('An unknown error occurred')
    console.error(e)
  })
