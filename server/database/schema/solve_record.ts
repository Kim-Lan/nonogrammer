// import { integer, pgTable, timestamp } from 'drizzle-orm/pg-core';
// import { puzzles } from './puzzle';
//
// export const solveRecords = pgTable('solve_records', {
//   puzzleId: integer().notNull().references(() => puzzles.id, { onDelete: 'cascade' }),
//   userId: integer().notNull().references(() => users.id, { onDelete: 'cascade' }),
//   startTime: timestamp().notNull(),
//   endTime: timestamp().defaultNow().notNull(),
//   totalTime: interval().notNull(),
//   createdAt: timestamp().defaultNow().notNull(),
//   updatedAt: timestamp().defaultNow().notNull().$onUpdate(() => Date.now()),
// });
