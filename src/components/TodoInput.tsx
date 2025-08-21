import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface TodoInputProps {
  onAddTodo: (title: string, details?: string) => void;
}

const TodoInput = ({ onAddTodo }: TodoInputProps) => {
  const [title, setTitle] = useState('');
  const [details, setDetails] = useState('');
  const [expanded, setExpanded] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAddTodo(title, details);
    setTitle('');
    setDetails('');
    setExpanded(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="todo-input">
        <input 
          type="text" 
          placeholder="Add a new task..." 
          className="flex-1 bg-transparent border-0 focus:outline-none" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setExpanded(true)}
        />
        <Button 
          type="submit" 
          className="add-button" 
          disabled={!title.trim()}
          aria-label="Add task"
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>
      
      {expanded && (
        <div className="mt-2">
          <Textarea
            placeholder="Add details (optional)"
            className="min-h-[80px] resize-none"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>
      )}
    </form>
  );
};

export default TodoInput;
