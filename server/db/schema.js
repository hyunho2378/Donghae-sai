import {
  pgTable, pgEnum,
  uuid, varchar, integer, timestamp, date
} from 'drizzle-orm/pg-core'

export const roleEnum = pgEnum('role', ['walk2030', 'car2030', 'walk4050', 'car4050'])
export const reservationStatusEnum = pgEnum('reservation_status', ['pending', 'confirmed', 'completed', 'cancelled'])
export const transactionTypeEnum = pgEnum('transaction_type', ['credit', 'debit'])

export const profiles = pgTable('profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  authId: varchar('auth_id', { length: 255 }),
  email: varchar('email', { length: 255 }),
  name: varchar('name', { length: 255 }),
  role: roleEnum('role').default('walk2030').notNull(),
  stamps: varchar('stamps', { length: 200 }).default('').notNull(),
  totalVisits: integer('total_visits').default(0).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const reservations = pgTable('reservations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id),
  stayExternalId: varchar('stay_external_id', { length: 100 }),
  packageExternalId: varchar('package_external_id', { length: 100 }),
  checkIn: date('check_in'),
  checkOut: date('check_out'),
  guests: integer('guests').default(1).notNull(),
  totalPrice: integer('total_price').notNull(),
  status: reservationStatusEnum('status').default('pending').notNull(),
  passCode: varchar('pass_code', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})

export const transactions = pgTable('transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id').references(() => profiles.id),
  amount: integer('amount').notNull(),
  type: transactionTypeEnum('type').notNull(),
  description: varchar('description', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
})
