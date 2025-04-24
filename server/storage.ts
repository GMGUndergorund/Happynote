import { 
  users, type User, type InsertUser, 
  notes, type Note, type InsertNote,
  tags, type Tag, type InsertTag,
  connections, type Connection, type InsertConnection,
  noteTags, type NoteTag, type InsertNoteTag
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  // User CRUD
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Note CRUD
  getNotesByUserId(userId: number): Promise<Note[]>;
  getNoteById(id: number): Promise<Note | undefined>;
  createNote(note: InsertNote): Promise<Note>;
  updateNote(id: number, note: Partial<InsertNote>): Promise<Note | undefined>;
  deleteNote(id: number): Promise<boolean>;
  
  // Tag CRUD
  getTagsByUserId(userId: number): Promise<Tag[]>;
  getTagById(id: number): Promise<Tag | undefined>;
  createTag(tag: InsertTag): Promise<Tag>;
  updateTag(id: number, tag: Partial<InsertTag>): Promise<Tag | undefined>;
  deleteTag(id: number): Promise<boolean>;
  
  // Connection CRUD
  getConnectionsByUserId(userId: number): Promise<Connection[]>;
  getConnectionById(id: number): Promise<Connection | undefined>;
  createConnection(connection: InsertConnection): Promise<Connection>;
  deleteConnection(id: number): Promise<boolean>;
  
  // NoteTag CRUD
  getNoteTagsByNoteId(noteId: number): Promise<NoteTag[]>;
  getNoteTagsByTagId(tagId: number): Promise<NoteTag[]>;
  createNoteTag(noteTag: InsertNoteTag): Promise<NoteTag>;
  deleteNoteTag(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private notes: Map<number, Note>;
  private tags: Map<number, Tag>;
  private connections: Map<number, Connection>;
  private noteTags: Map<number, NoteTag>;
  currentUserId: number;
  currentNoteId: number;
  currentTagId: number;
  currentConnectionId: number;
  currentNoteTagId: number;

  constructor() {
    this.users = new Map();
    this.notes = new Map();
    this.tags = new Map();
    this.connections = new Map();
    this.noteTags = new Map();
    this.currentUserId = 1;
    this.currentNoteId = 1;
    this.currentTagId = 1;
    this.currentConnectionId = 1;
    this.currentNoteTagId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Note methods
  async getNotesByUserId(userId: number): Promise<Note[]> {
    return Array.from(this.notes.values()).filter(
      (note) => note.userId === userId,
    );
  }

  async getNoteById(id: number): Promise<Note | undefined> {
    return this.notes.get(id);
  }

  async createNote(insertNote: InsertNote): Promise<Note> {
    const id = this.currentNoteId++;
    const now = new Date();
    const note: Note = { 
      ...insertNote, 
      id, 
      createdAt: now, 
      updatedAt: now 
    };
    this.notes.set(id, note);
    return note;
  }

  async updateNote(id: number, updateData: Partial<InsertNote>): Promise<Note | undefined> {
    const note = this.notes.get(id);
    if (!note) return undefined;
    
    const updatedNote: Note = { 
      ...note, 
      ...updateData, 
      updatedAt: new Date() 
    };
    this.notes.set(id, updatedNote);
    return updatedNote;
  }

  async deleteNote(id: number): Promise<boolean> {
    return this.notes.delete(id);
  }

  // Tag methods
  async getTagsByUserId(userId: number): Promise<Tag[]> {
    return Array.from(this.tags.values()).filter(
      (tag) => tag.userId === userId,
    );
  }

  async getTagById(id: number): Promise<Tag | undefined> {
    return this.tags.get(id);
  }

  async createTag(insertTag: InsertTag): Promise<Tag> {
    const id = this.currentTagId++;
    const tag: Tag = { ...insertTag, id };
    this.tags.set(id, tag);
    return tag;
  }

  async updateTag(id: number, updateData: Partial<InsertTag>): Promise<Tag | undefined> {
    const tag = this.tags.get(id);
    if (!tag) return undefined;
    
    const updatedTag: Tag = { ...tag, ...updateData };
    this.tags.set(id, updatedTag);
    return updatedTag;
  }

  async deleteTag(id: number): Promise<boolean> {
    return this.tags.delete(id);
  }

  // Connection methods
  async getConnectionsByUserId(userId: number): Promise<Connection[]> {
    return Array.from(this.connections.values()).filter(
      (connection) => connection.userId === userId,
    );
  }

  async getConnectionById(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = this.currentConnectionId++;
    const connection: Connection = { ...insertConnection, id };
    this.connections.set(id, connection);
    return connection;
  }

  async deleteConnection(id: number): Promise<boolean> {
    return this.connections.delete(id);
  }

  // NoteTag methods
  async getNoteTagsByNoteId(noteId: number): Promise<NoteTag[]> {
    return Array.from(this.noteTags.values()).filter(
      (noteTag) => noteTag.noteId === noteId,
    );
  }

  async getNoteTagsByTagId(tagId: number): Promise<NoteTag[]> {
    return Array.from(this.noteTags.values()).filter(
      (noteTag) => noteTag.tagId === tagId,
    );
  }

  async createNoteTag(insertNoteTag: InsertNoteTag): Promise<NoteTag> {
    const id = this.currentNoteTagId++;
    const noteTag: NoteTag = { ...insertNoteTag, id };
    this.noteTags.set(id, noteTag);
    return noteTag;
  }

  async deleteNoteTag(id: number): Promise<boolean> {
    return this.noteTags.delete(id);
  }
}

export const storage = new MemStorage();
