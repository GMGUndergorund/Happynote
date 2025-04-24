import { useState } from 'react';
import { MapPinned, Share, Download, Save, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useNoteMap } from '@/lib/store';

const AppHeader = () => {
  const { 
    addNote, 
    setSearchQuery, 
    searchQuery, 
    showToast 
  } = useNoteMap();

  const [isAutoSaved, setIsAutoSaved] = useState(true);

  const handleAddNote = () => {
    const canvasCenter = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const newNote = {
      title: 'New Note',
      content: 'Start typing here...',
      position: canvasCenter,
      tags: [],
      color: '#6366F1',
    };

    const id = addNote(newNote);
    showToast('Note created!', 'Your new note is ready for editing.');
  };

  const handleExport = () => {
    alert('Export functionality will be implemented here');
  };

  const handleShare = () => {
    showToast('Sharing is caring!', 'This feature is coming soon.');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <MapPinned className="text-primary text-2xl mr-2" />
            <h1 className="text-xl font-heading font-bold text-gray-800 dark:text-white">HappyNoteMap</h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" /> Autosaved
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleShare}
            >
              <Share className="h-4 w-4" /> Share
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={handleExport}
            >
              <Download className="h-4 w-4" /> Export
            </Button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="relative md:w-64">
            <Input
              type="text"
              placeholder="Search notes or tags..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="text-gray-400 absolute left-3 top-2.5 h-4 w-4" />
          </div>
          
          <Button 
            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-1"
            onClick={handleAddNote}
          >
            <Plus className="h-4 w-4" /> New Note
          </Button>
          
          <div className="relative flex items-center">
            <div className="size-10 rounded-full bg-secondary text-white flex items-center justify-center">
              <span className="font-medium">JD</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
