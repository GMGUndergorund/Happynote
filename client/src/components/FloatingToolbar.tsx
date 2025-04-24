import { Text, Image, Palette, Link, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNoteMap } from '@/lib/store';

const FloatingToolbar = () => {
  const { 
    selectedNote, 
    setEditingNote, 
    notes, 
    updateNote, 
    deleteNote, 
    showToast 
  } = useNoteMap();

  if (!selectedNote) return null;

  const currentNote = notes.find(note => note.id === selectedNote);
  if (!currentNote) return null;

  const handleEdit = () => {
    setEditingNote(selectedNote);
  };

  const handleDelete = () => {
    deleteNote(selectedNote);
    showToast('Note deleted!', 'Your note has been removed.');
  };

  const handleFormatting = () => {
    setEditingNote(selectedNote);
    showToast('Ready to format!', 'You can use Markdown for rich formatting.');
  };

  const handleChangeColor = () => {
    setEditingNote(selectedNote);
    showToast('Ready to customize!', 'Change the color of your note.');
  };

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-full shadow-lg px-2 py-1.5 flex items-center space-x-1 border border-gray-200 dark:border-gray-700 z-20">
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
        title="Text Formatting"
        onClick={handleFormatting}
      >
        <Text className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
        title="Add Image"
        onClick={handleEdit}
      >
        <Image className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 bg-gray-200 dark:bg-gray-600" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
        title="Change Color"
        onClick={handleChangeColor}
      >
        <Palette className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full" 
        title="Add Link"
        onClick={handleEdit}
      >
        <Link className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </Button>
      
      <Separator orientation="vertical" className="h-6 bg-gray-200 dark:bg-gray-600" />
      
      <Button 
        variant="ghost" 
        size="icon" 
        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-red-500 dark:text-red-400" 
        title="Delete"
        onClick={handleDelete}
      >
        <Trash className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default FloatingToolbar;
