import { useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import Sidebar from '@/components/Sidebar';
import MainCanvas from '@/components/MainCanvas';
import NoteEditor from '@/components/NoteEditor';
import FloatingToolbar from '@/components/FloatingToolbar';
import Toast from '@/components/Toast';
import { useNoteMap } from '@/lib/store';

const Home = () => {
  const { 
    selectedNote, 
    editingNote, 
    setEditingNote, 
    toast
  } = useNoteMap();

  // Set page title
  useEffect(() => {
    document.title = 'HappyNoteMap - A Delightful Visual Note Mapping App';
  }, []);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 font-sans text-gray-800 dark:text-gray-200 h-screen flex flex-col">
      <AppHeader />
      <div className="flex-grow flex overflow-hidden">
        <Sidebar />
        <MainCanvas />
        {editingNote && <NoteEditor />}
      </div>
      {selectedNote && <FloatingToolbar />}
      {toast && <Toast title={toast.title} message={toast.message} />}
    </div>
  );
};

export default Home;
