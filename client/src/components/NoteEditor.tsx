import { useState, useEffect } from 'react';
import { X, Save, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useNoteMap } from '@/lib/store';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

const NoteEditor = () => {
  const { 
    notes, 
    tags: allTags, 
    editingNote, 
    setEditingNote, 
    updateNote, 
    deleteNote,
    showToast
  } = useNoteMap();

  const currentNote = notes.find(note => note.id === editingNote);
  
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isPreview, setIsPreview] = useState(false);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Set initial values when the editing note changes
  useEffect(() => {
    if (currentNote) {
      setTitle(currentNote.title);
      setContent(currentNote.content);
      setSelectedColor(currentNote.color || '#6366F1');
      setSelectedTags(currentNote.tags || []);
    }
  }, [currentNote]);

  if (!currentNote) return null;

  const handleSave = () => {
    updateNote(editingNote!, {
      title,
      content,
      tags: selectedTags,
      color: selectedColor,
    });
    
    showToast('Changes saved!', 'Your note has been updated.');
    setEditingNote(null);
  };

  const handleDelete = () => {
    deleteNote(editingNote!);
    setEditingNote(null);
    showToast('Note deleted!', 'Your note has been removed.');
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      // Find if tag already exists
      const existingTag = allTags.find(
        tag => tag.name.toLowerCase() === tagInput.trim().toLowerCase()
      );
      
      if (existingTag) {
        // Add tag if not already selected
        if (!selectedTags.includes(existingTag.id)) {
          setSelectedTags([...selectedTags, existingTag.id]);
        }
      } else {
        // Could create a new tag here, but for now just showing a message
        showToast('Tag not found', 'This tag does not exist.');
      }
      
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags(selectedTags.filter(id => id !== tagId));
  };

  // Get the tag objects for the selected tag IDs
  const noteTagObjects = allTags.filter(tag => selectedTags.includes(tag.id));

  // Define color options
  const colorOptions = [
    { id: 'white', color: 'white', borderColor: 'border-gray-300' },
    { id: 'green', color: '#10B981', borderColor: 'border-[#10B981]' },
    { id: 'purple', color: '#8B5CF6', borderColor: 'border-[#8B5CF6]' },
    { id: 'yellow', color: '#F59E0B', borderColor: 'border-[#F59E0B]' },
    { id: 'pink', color: '#EC4899', borderColor: 'border-[#EC4899]' },
  ];

  return (
    <div className="w-96 border-l border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col shadow-md">
      <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="font-medium text-lg dark:text-white">Edit Note</h2>
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={handleDelete}
          >
            <Trash className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={() => setEditingNote(null)}
          >
            <X className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          </Button>
        </div>
      </div>
      
      <div className="p-4 flex-grow overflow-y-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
            <Input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
              <div className="flex items-center text-xs text-gray-500">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className={!isPreview ? "bg-gray-100 dark:bg-gray-700" : ""}
                  onClick={() => setIsPreview(false)}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className={isPreview ? "bg-gray-100 dark:bg-gray-700" : ""}
                  onClick={() => setIsPreview(true)}
                >
                  Preview
                </Button>
              </div>
            </div>
            
            {isPreview ? (
              <div className="min-h-32 border border-gray-300 dark:border-gray-600 rounded-lg p-3 markdown prose-sm dark:prose-invert">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full min-h-32 font-mono text-sm"
              />
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tags</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {noteTagObjects.map(tag => (
                <div 
                  key={tag.id}
                  className="flex items-center px-2 py-1 rounded-md text-sm"
                  style={{ 
                    backgroundColor: `${tag.color}20`, 
                    color: tag.color 
                  }}
                >
                  {tag.name}
                  <button 
                    className="ml-1.5 hover:opacity-80"
                    onClick={() => handleRemoveTag(tag.id)}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
            <Input 
              type="text" 
              placeholder="Add a tag..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Color</label>
            <div className="flex space-x-2">
              {colorOptions.map(option => (
                <label key={option.id} className="cursor-pointer">
                  <input 
                    type="radio" 
                    name="noteColor" 
                    className="sr-only" 
                    checked={selectedColor === option.color}
                    onChange={() => setSelectedColor(option.color)}
                  />
                  <div 
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center border-2",
                      option.borderColor,
                      selectedColor === option.color ? "border-opacity-100" : "border-opacity-0 hover:border-opacity-50"
                    )}
                    style={{ 
                      backgroundColor: option.color === 'white' ? 'white' : `${option.color}20` 
                    }}
                  >
                    {selectedColor === option.color && (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" style={{ color: option.color !== 'white' ? option.color : '#6B7280' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <Button 
          className="w-full py-2 bg-primary hover:bg-primary/90 text-white"
          onClick={handleSave}
        >
          <Save className="h-4 w-4 mr-2" /> Save Changes
        </Button>
      </div>
    </div>
  );
};

export default NoteEditor;
