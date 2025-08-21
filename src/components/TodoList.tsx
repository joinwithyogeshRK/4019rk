import { useState } from 'react';
import { Check, Trash2, Edit, Calendar, Tag, X, Plus } from 'lucide-react';
import { Todo } from '@/types/todo';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

interface TodoListProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdate: (todo: Todo) => void;
}

const TodoList = ({ todos, onToggle, onDelete, onUpdate }: TodoListProps) => {
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editTag, setEditTag] = useState('');
  
  const openEditDialog = (todo: Todo) => {
    setEditingTodo(todo);
    setEditTitle(todo.title);
    setEditDetails(todo.details || '');
    setEditDueDate(todo.dueDate ? new Date(todo.dueDate).toISOString().split('T')[0] : '');
    setEditTag('');
  };
  
  const closeEditDialog = () => {
    setEditingTodo(null);
  };
  
  const handleSaveEdit = () => {
    if (!editingTodo) return;
    
    const updatedTodo: Todo = {
      ...editingTodo,
      title: editTitle,
      details: editDetails,
      dueDate: editDueDate ? new Date(editDueDate).toISOString() : null
    };
    
    onUpdate(updatedTodo);
    closeEditDialog();
  };
  
  const addTag = () => {
    if (!editingTodo || !editTag.trim()) return;
    
    const updatedTags = [...editingTodo.tags, editTag.trim()];
    setEditingTodo({ ...editingTodo, tags: updatedTags });
    setEditTag('');
  };
  
  const removeTag = (tagToRemove: string) => {
    if (!editingTodo) return;
    
    const updatedTags = editingTodo.tags.filter(tag => tag !== tagToRemove);
    setEditingTodo({ ...editingTodo, tags: updatedTags });
  };
  
  return (
    <div className="space-y-3">
      {todos.map(todo => (
        <div 
          key={todo.id} 
          className={`todo-card group ${todo.completed ? 'todo-completed' : ''}`}
        >
          <div className="flex items-start gap-3">
            <input 
              type="checkbox" 
              checked={todo.completed} 
              onChange={() => onToggle(todo.id)} 
              className="todo-checkbox peer mt-1"
            />
            <div className="flex-1 peer-checked:opacity-70 transition-opacity">
              <h3 className="todo-title group-hover:text-primary transition-colors">
                {todo.title}
              </h3>
              {todo.details && (
                <p className="todo-details">{todo.details}</p>
              )}
              <div className="flex flex-wrap justify-between items-center mt-2">
                <div className="flex items-center gap-1">
                  {todo.dueDate && (
                    <span className="todo-date flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Due: {new Date(todo.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {todo.tags && todo.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="todo-tag">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => openEditDialog(todo)}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => onDelete(todo.id)}
                className="h-8 w-8 text-muted-foreground hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}
      
      <Dialog open={!!editingTodo} onOpenChange={(open) => !open && closeEditDialog()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">Title</label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                placeholder="Task title"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="details" className="text-sm font-medium">Details</label>
              <Textarea
                id="details"
                value={editDetails}
                onChange={(e) => setEditDetails(e.target.value)}
                placeholder="Add details"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="dueDate" className="text-sm font-medium">Due Date</label>
              <Input
                id="dueDate"
                type="date"
                value={editDueDate}
                onChange={(e) => setEditDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">Tags</label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={editTag}
                  onChange={(e) => setEditTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  variant="outline"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {editingTodo?.tags && editingTodo.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {editingTodo.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="flex items-center gap-1 todo-tag">
                      {tag}
                      <button 
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full hover:bg-primary-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={closeEditDialog}>Cancel</Button>
            <Button 
              onClick={handleSaveEdit} 
              disabled={!editTitle.trim()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TodoList;