import { pgTable, serial, varchar, integer, timestamp, boolean, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Seasons table
export const seasons = pgTable('seasons', {
  id: serial('id').primaryKey(),
  year: integer('year').notNull(),
  isActive: boolean('is_active').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Stages (Monthly tournaments) table
export const stages = pgTable('stages', {
  id: serial('id').primaryKey(),
  seasonId: integer('season_id').references(() => seasons.id),
  name: varchar('name', { length: 255 }).notNull(),
  month: integer('month').notNull(),
  status: varchar('status', { length: 50 }).default('pending'), // pending, active, completed
  format: varchar('format', { length: 50 }).notNull(), // single_match, home_away
  createdAt: timestamp('created_at').defaultNow(),
});

// Participants table
export const participants = pgTable('participants', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 255 }).notNull(), // Clerk user ID
  stageId: integer('stage_id').references(() => stages.id),
  team: varchar('team', { length: 255 }), // Optional fixed team
  createdAt: timestamp('created_at').defaultNow(),
});

// Groups table
export const groups = pgTable('groups', {
  id: serial('id').primaryKey(),
  stageId: integer('stage_id').references(() => stages.id),
  name: varchar('name', { length: 50 }).notNull(), // A, B, C, etc.
});

// Matches table
export const matches = pgTable('matches', {
  id: serial('id').primaryKey(),
  stageId: integer('stage_id').references(() => stages.id),
  groupId: integer('group_id').references(() => groups.id),
  homeParticipantId: integer('home_participant_id').references(() => participants.id),
  awayParticipantId: integer('away_participant_id').references(() => participants.id),
  homeScore: integer('home_score'),
  awayScore: integer('away_score'),
  round: integer('round').notNull(),
  phase: varchar('phase', { length: 50 }).notNull(), // group, knockout
  played: boolean('played').default(false),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define relationships
export const seasonsRelations = relations(seasons, ({ many }) => ({
  stages: many(stages),
}));

export const stagesRelations = relations(stages, ({ one, many }) => ({
  season: one(seasons, {
    fields: [stages.seasonId],
    references: [seasons.id],
  }),
  participants: many(participants),
  matches: many(matches),
  groups: many(groups),
})); 