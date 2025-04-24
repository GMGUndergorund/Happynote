import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import ReactMarkdown from 'react-markdown';
import { Plus, MoreHorizontal, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNoteMap } from '@/lib/store';
import { cn } from '@/lib/utils';
import type { NoteData, TagData } from '@shared/schema';

interface NoteNodeProps extends NodeProps {
  data: NoteData & {
    isSelected: boolean;
  };
}

const NoteNode = ({ id, data }: NoteNodeProps) => {
  const { 
    tags: allTags, 
    selectNote, 
    setEditingNote,
    updateNote,
    deleteNote,
    addNote,
    showToast
  } = useNoteMap();

  const [showMenu, setShowMenu] = useState(false);

  // Find tags data for this note
  const noteTags = allTags.filter(tag => data.tags.includes(tag.id));
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    selectNote(id);
  };

  const handleEdit = () => {
    setEditingNote(id);
  };

  const handleAddChildNote = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Calculate position for new child note (below the current note)
    const parentPosition = data.position;
    const childPosition = {
      x: parentPosition.x + 30,
      y: parentPosition.y + 150,
    };
    
    const newNote = {
      title: `Sub-note of ${data.title}`,
      content: 'Start typing here...',
      position: childPosition,
      tags: data.tags,
      color: data.color,
    };
    
    const newNoteId = addNote(newNote);
    showToast('Child note created!', 'Connected to the parent note.');
  };
  
  const toggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <div 
      className={cn(
        "note-node bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md cursor-move",
        data.isSelected && "selected shadow-lg border-2 border-primary"
      )}
      style={{ width: '300px' }}
      onClick={handleClick}
      onDoubleClick={handleEdit}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 border-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        isConnectable={true}
      />

      <div className="flex justify-between items-start mb-1.5">
        <h3 className="font-semibold text-lg text-gray-800 dark:text-gray-100">{data.title}</h3>
        <div className="flex space-x-0.5">
          <Button 
            variant="ghost" 
            size="icon" 
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500"
            onClick={toggleMenu}
          >
            <MoreHorizontal className="h-4 w-4" />
          </Button>
          
          {showMenu && (
            <div className="absolute right-0 mt-8 w-36 bg-white dark:bg-gray-800 rounded-md shadow-md z-10 border border-gray-200 dark:border-gray-700">
              <div className="py-1">
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={handleEdit}
                >
                  Edit
                </button>
                <button 
                  className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => deleteNote(id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="markdown prose-sm dark:prose-invert">
        <ReactMarkdown>{data.content}</ReactMarkdown>
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex items-center space-x-1 flex-wrap">
          {noteTags.map(tag => (
            <span 
              key={tag.id}
              className="inline-block px-2 py-0.5 text-xs rounded mb-1"
              style={{ 
                backgroundColor: `${tag.color}10`, 
                color: tag.color 
              }}
            >
              {tag.name}
            </span>
          ))}
        </div>
        <div className="connection-handle size-6 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center cursor-crosshair">
          <Link className="h-4 w-4 text-gray-400" />
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="w-3 h-3 border-2 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600"
        isConnectable={true}
      />

      <div className="absolute -bottom-1.5 inset-x-0 flex justify-center">
        <Button
          variant="outline"
          size="icon"
          className="size-7 rounded-full bg-white dark:bg-gray-800 shadow border border-gray-100 dark:border-gray-700 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-700"
          onClick={handleAddChildNote}
        >
          <Plus className="h-4 w-4 text-primary" />
        </Button>
      </div>
    </div>
  );
};

export default memo(NoteNode);
