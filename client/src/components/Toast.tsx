import { useEffect } from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNoteMap } from '@/lib/store';

interface ToastProps {
  title: string;
  message: string;
}

const Toast = ({ title, message }: ToastProps) => {
  const { clearToast } = useNoteMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      clearToast();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [clearToast]);
  
  return (
    <div className={cn(
      "fixed bottom-4 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg px-4 py-3",
      "flex items-center space-x-3 border-l-4 border-accent2 z-50",
      "animate-in fade-in slide-in-from-bottom-5 duration-300"
    )}>
      <div className="flex-shrink-0 text-accent2">
        <Check className="h-5 w-5" />
      </div>
      <div>
        <p className="font-medium text-gray-800 dark:text-gray-100">{title}</p>
        <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
      </div>
    </div>
  );
};

export default Toast;
