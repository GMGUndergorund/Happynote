import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertNoteSchema, insertTagSchema, insertConnectionSchema, insertNoteTagSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for notes
  app.get("/api/notes", async (req, res) => {
    try {
      // In a real app, this would use actual user auth
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      const notes = await storage.getNotesByUserId(userId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch notes" });
    }
  });

  app.get("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const note = await storage.getNoteById(id);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note" });
    }
  });

  app.post("/api/notes", async (req, res) => {
    try {
      const validatedData = insertNoteSchema.parse(req.body);
      const note = await storage.createNote(validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.put("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertNoteSchema.partial().parse(req.body);
      const note = await storage.updateNote(id, validatedData);
      if (!note) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ message: "Invalid note data" });
    }
  });

  app.delete("/api/notes/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteNote(id);
      if (!success) {
        return res.status(404).json({ message: "Note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note" });
    }
  });

  // API routes for tags
  app.get("/api/tags", async (req, res) => {
    try {
      // In a real app, this would use actual user auth
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      const tags = await storage.getTagsByUserId(userId);
      res.json(tags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tags" });
    }
  });

  app.post("/api/tags", async (req, res) => {
    try {
      const validatedData = insertTagSchema.parse(req.body);
      const tag = await storage.createTag(validatedData);
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ message: "Invalid tag data" });
    }
  });

  app.put("/api/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTagSchema.partial().parse(req.body);
      const tag = await storage.updateTag(id, validatedData);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.json(tag);
    } catch (error) {
      res.status(400).json({ message: "Invalid tag data" });
    }
  });

  app.delete("/api/tags/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteTag(id);
      if (!success) {
        return res.status(404).json({ message: "Tag not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tag" });
    }
  });

  // API routes for connections
  app.get("/api/connections", async (req, res) => {
    try {
      // In a real app, this would use actual user auth
      const userId = req.query.userId ? parseInt(req.query.userId as string) : 1;
      const connections = await storage.getConnectionsByUserId(userId);
      res.json(connections);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  app.post("/api/connections", async (req, res) => {
    try {
      const validatedData = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(validatedData);
      res.status(201).json(connection);
    } catch (error) {
      res.status(400).json({ message: "Invalid connection data" });
    }
  });

  app.delete("/api/connections/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteConnection(id);
      if (!success) {
        return res.status(404).json({ message: "Connection not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete connection" });
    }
  });

  // API routes for note tags
  app.get("/api/notes/:noteId/tags", async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const noteTags = await storage.getNoteTagsByNoteId(noteId);
      
      // Fetch the actual tag data for each noteTag
      const tagPromises = noteTags.map(async (noteTag) => {
        return storage.getTagById(noteTag.tagId);
      });
      const tags = await Promise.all(tagPromises);
      const validTags = tags.filter((tag): tag is NonNullable<typeof tag> => tag !== undefined);
      
      res.json(validTags);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch note tags" });
    }
  });

  app.post("/api/notes/:noteId/tags", async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const { tagId } = req.body;
      
      const noteTag = await storage.createNoteTag({ 
        noteId, 
        tagId: parseInt(tagId) 
      });
      
      const tag = await storage.getTagById(noteTag.tagId);
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }
      
      res.status(201).json(tag);
    } catch (error) {
      res.status(400).json({ message: "Invalid note tag data" });
    }
  });

  app.delete("/api/notes/:noteId/tags/:tagId", async (req, res) => {
    try {
      const noteId = parseInt(req.params.noteId);
      const tagId = parseInt(req.params.tagId);
      
      // Find the noteTag to delete
      const noteTags = await storage.getNoteTagsByNoteId(noteId);
      const noteTag = noteTags.find(nt => nt.tagId === tagId);
      
      if (!noteTag) {
        return res.status(404).json({ message: "Note tag not found" });
      }
      
      const success = await storage.deleteNoteTag(noteTag.id);
      if (!success) {
        return res.status(500).json({ message: "Failed to delete note tag" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete note tag" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
