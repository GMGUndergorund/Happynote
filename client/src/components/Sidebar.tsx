import { useState } from 'react';
import { useNoteMap } from '@/lib/store';
import { 
  MapPinned, 
  FolderClosed, 
  Bookmark, 
  Users, 
  Archive
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem = ({ icon, label, active, onClick }: SidebarItemProps) => {
  return (
    <Button
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "flex items-center px-4 py-2.5 w-full justify-start",
        active ? "bg-primary/10 text-primary" : "text-gray-700 dark:text-gray-300 hover:text-primary"
      )}
      onClick={onClick}
    >
      {icon}
      <span className="ml-3 font-medium hidden md:inline">{label}</span>
    </Button>
  );
};

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('mindmap');
  const { tags, theme, setTheme } = useNoteMap();

  return (
    <div className="w-16 md:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col transition-all duration-300">
      <div className="flex flex-col items-center md:items-start py-4">
        <div className="flex flex-col space-y-1 w-full">
          <SidebarItem 
            icon={<MapPinned className="h-5 w-5" />} 
            label="Mind Map" 
            active={activeTab === 'mindmap'}
            onClick={() => setActiveTab('mindmap')}
          />
          
          <SidebarItem 
            icon={<FolderClosed className="h-5 w-5" />} 
            label="My Maps" 
            active={activeTab === 'mymaps'}
            onClick={() => setActiveTab('mymaps')}
          />
          
          <SidebarItem 
            icon={<Bookmark className="h-5 w-5" />} 
            label="Saved Notes" 
            active={activeTab === 'saved'}
            onClick={() => setActiveTab('saved')}
          />
          
          <SidebarItem 
            icon={<Users className="h-5 w-5" />} 
            label="Shared With Me" 
            active={activeTab === 'shared'}
            onClick={() => setActiveTab('shared')}
          />
          
          <SidebarItem 
            icon={<Archive className="h-5 w-5" />} 
            label="Archive" 
            active={activeTab === 'archive'}
            onClick={() => setActiveTab('archive')}
          />
        </div>
      </div>
      
      <div className="mt-6 px-4 hidden md:block">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">TAGS</h2>
        <div className="space-y-2">
          {tags.map(tag => (
            <div key={tag.id} className="flex items-center space-x-2">
              <span 
                className="size-3 rounded-full" 
                style={{ backgroundColor: tag.color }}
              ></span>
              <span className="text-sm text-gray-700 dark:text-gray-300">{tag.name}</span>
              <span className="text-xs text-gray-400 ml-auto">
                {Math.floor(Math.random() * 15) + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto px-4 py-4 hidden md:block">
        <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">COLOR THEME</h2>
        <div className="theme-selector grid grid-cols-3 gap-2">
          <label className="cursor-pointer">
            <input 
              type="radio" 
              name="theme" 
              className="sr-only" 
              checked={theme === 'light'} 
              onChange={() => setTheme('light')}
            />
            <div className="theme-option h-8 w-full rounded-md border-2 border-transparent bg-gradient-to-r from-primary to-secondary"></div>
          </label>
          <label className="cursor-pointer">
            <input 
              type="radio" 
              name="theme" 
              className="sr-only" 
              checked={theme === 'green'} 
              onChange={() => setTheme('green')}
            />
            <div className="theme-option h-8 w-full rounded-md border-2 border-transparent bg-gradient-to-r from-green-400 to-blue-500"></div>
          </label>
          <label className="cursor-pointer">
            <input 
              type="radio" 
              name="theme" 
              className="sr-only" 
              checked={theme === 'dark'} 
              onChange={() => setTheme('dark')}
            />
            <div className="theme-option h-8 w-full rounded-md border-2 border-transparent bg-gradient-to-r from-yellow-500 to-red-500"></div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
