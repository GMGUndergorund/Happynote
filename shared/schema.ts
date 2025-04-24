import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  color: text("color").notNull(),
  userId: integer("user_id").references(() => users.id),
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  color: true,
  userId: true,
});

export type InsertTag = z.infer<typeof insertTagSchema>;
export type Tag = typeof tags.$inferSelect;

export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  position: jsonb("position").notNull().$type<{ x: number, y: number }>(),
  color: text("color"),
  userId: integer("user_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertNoteSchema = createInsertSchema(notes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertNote = z.infer<typeof insertNoteSchema>;
export type Note = typeof notes.$inferSelect;

export const noteTags = pgTable("note_tags", {
  id: serial("id").primaryKey(),
  noteId: integer("note_id").references(() => notes.id),
  tagId: integer("tag_id").references(() => tags.id),
});

export const insertNoteTagSchema = createInsertSchema(noteTags).omit({
  id: true,
});

export type InsertNoteTag = z.infer<typeof insertNoteTagSchema>;
export type NoteTag = typeof noteTags.$inferSelect;

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  sourceId: integer("source_id").references(() => notes.id),
  targetId: integer("target_id").references(() => notes.id),
  userId: integer("user_id").references(() => users.id),
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
});

export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type Connection = typeof connections.$inferSelect;

// This schema is used for the frontend to store note data
export const noteSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  tags: z.array(z.string()).default([]),
  color: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type NoteData = z.infer<typeof noteSchema>;

export const connectionSchema = z.object({
  id: z.string(),
  source: z.string(),
  target: z.string(),
});

export type ConnectionData = z.infer<typeof connectionSchema>;

export const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  color: z.string(),
});

export type TagData = z.infer<typeof tagSchema>;
