import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { NoteData, ConnectionData, TagData } from '@shared/schema';

interface Position {
  x: number;
  y: number;
}

interface CanvasState {
  position: Position;
  scale: number;
}

interface NoteMapState {
  notes: NoteData[];
  connections: ConnectionData[];
  tags: TagData[];
  selectedNote: string | null;
  editingNote: string | null;
  canvasState: CanvasState;
  searchQuery: string;
  toast: { title: string; message: string } | null;
  theme: string;
  
  // Note actions
  addNote: (note: Omit<NoteData, 'id'>) => void;
  updateNote: (id: string, data: Partial<NoteData>) => void;
  deleteNote: (id: string) => void;
  selectNote: (id: string | null) => void;
  setEditingNote: (id: string | null) => void;
  
  // Connection actions
  addConnection: (source: string, target: string) => void;
  deleteConnection: (id: string) => void;
  
  // Tag actions
  addTag: (tag: Omit<TagData, 'id'>) => void;
  deleteTag: (id: string) => void;
  
  // Canvas actions
  updateCanvasState: (state: Partial<CanvasState>) => void;
  
  // Other actions
  setSearchQuery: (query: string) => void;
  showToast: (title: string, message: string) => void;
  clearToast: () => void;
  setTheme: (theme: string) => void;
}

// Define some default tags with pastel colors
const defaultTags: TagData[] = [
  { id: 'tag-1', name: 'Ideas', color: '#8B5CF6' }, // accent1
  { id: 'tag-2', name: 'Projects', color: '#10B981' }, // accent2
  { id: 'tag-3', name: 'Personal', color: '#F59E0B' }, // accent3
  { id: 'tag-4', name: 'Work', color: '#EC4899' }, // secondary
];

// Define some initial notes with positions
const initialNotes: NoteData[] = [
  {
    id: 'note-1',
    title: 'Project Ideas',
    content: 'Need to brainstorm on these potential projects:\n- Mobile app redesign\n- Blog revamp\n- New landing page',
    position: { x: 150, y: 300 },
    tags: ['tag-1', 'tag-3'],
    color: '#8B5CF6',
  },
  {
    id: 'note-2',
    title: 'Mobile App Redesign',
    content: 'Focus on improving the user experience and modernizing the visual design',
    position: { x: 400, y: 150 },
    tags: ['tag-2'],
    color: '#10B981',
  },
  {
    id: 'note-3',
    title: 'Blog Revamp Ideas',
    content: 'The blog needs a fresh look with:\n- New content categories\n- Better typography\n- Improved code snippets',
    position: { x: 500, y: 250 },
    tags: ['tag-2', 'tag-4'],
    color: '#10B981',
  },
  {
    id: 'note-4',
    title: 'UI Inspiration',
    content: 'Check out these sites:\n- Dribbble\n- Behance\n- Awwwards',
    position: { x: 520, y: 80 },
    tags: ['tag-1'],
    color: '#8B5CF6',
  },
];

// Define some initial connections
const initialConnections: ConnectionData[] = [
  { id: 'conn-1', source: 'note-1', target: 'note-2' },
  { id: 'conn-2', source: 'note-2', target: 'note-4' },
  { id: 'conn-3', source: 'note-2', target: 'note-3' },
];

export const useNoteMap = create<NoteMapState>()(
  persist(
    (set, get) => ({
      notes: initialNotes,
      connections: initialConnections,
      tags: defaultTags,
      selectedNote: null,
      editingNote: null,
      canvasState: {
        position: { x: 0, y: 0 },
        scale: 1,
      },
      searchQuery: '',
      toast: null,
      theme: 'light',
      
      // Note actions
      addNote: (note) => {
        const newNote: NoteData = {
          ...note,
          id: `note-${nanoid()}`,
          tags: note.tags || [],
        };
        set((state) => ({
          notes: [...state.notes, newNote],
        }));
        return newNote.id;
      },
      
      updateNote: (id, data) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...data, updatedAt: new Date() } : note
          ),
        }));
      },
      
      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
          connections: state.connections.filter(
            (conn) => conn.source !== id && conn.target !== id
          ),
          selectedNote: state.selectedNote === id ? null : state.selectedNote,
          editingNote: state.editingNote === id ? null : state.editingNote,
        }));
      },
      
      selectNote: (id) => {
        set({ selectedNote: id });
      },
      
      setEditingNote: (id) => {
        set({ editingNote: id });
      },
      
      // Connection actions
      addConnection: (source, target) => {
        // Avoid duplicate connections or self-connections
        if (source === target) return;
        
        const exists = get().connections.some(
          (conn) => conn.source === source && conn.target === target
        );
        
        if (!exists) {
          const newConnection: ConnectionData = {
            id: `conn-${nanoid()}`,
            source,
            target,
          };
          
          set((state) => ({
            connections: [...state.connections, newConnection],
          }));
          
          // Show a toast
          get().showToast('Connection created!', 'Your notes are now connected.');
        }
      },
      
      deleteConnection: (id) => {
        set((state) => ({
          connections: state.connections.filter((conn) => conn.id !== id),
        }));
      },
      
      // Tag actions
      addTag: (tag) => {
        const newTag: TagData = {
          ...tag,
          id: `tag-${nanoid()}`,
        };
        
        set((state) => ({
          tags: [...state.tags, newTag],
        }));
        
        return newTag.id;
      },
      
      deleteTag: (id) => {
        set((state) => ({
          tags: state.tags.filter((tag) => tag.id !== id),
          notes: state.notes.map((note) => ({
            ...note,
            tags: note.tags.filter((tagId) => tagId !== id),
          })),
        }));
      },
      
      // Canvas actions
      updateCanvasState: (state) => {
        set((prev) => ({
          canvasState: {
            ...prev.canvasState,
            ...state,
          },
        }));
      },
      
      // Other actions
      setSearchQuery: (query) => {
        set({ searchQuery: query });
      },
      
      showToast: (title, message) => {
        set({ toast: { title, message } });
        
        // Auto-dismiss after 3 seconds
        setTimeout(() => {
          set((state) => {
            if (state.toast && state.toast.title === title) {
              return { toast: null };
            }
            return {};
          });
        }, 3000);
      },
      
      clearToast: () => {
        set({ toast: null });
      },
      
      setTheme: (theme) => {
        set({ theme });
      },
    }),
    {
      name: 'happy-note-map-storage',
      partialize: (state) => ({
        notes: state.notes,
        connections: state.connections,
        tags: state.tags,
        theme: state.theme,
      }),
    }
  )
);

// Create a separate hook for theme
export const useTheme = () => {
  const theme = useNoteMap((state) => state.theme);
  const setTheme = useNoteMap((state) => state.setTheme);
  
  return { theme, setTheme };
};
