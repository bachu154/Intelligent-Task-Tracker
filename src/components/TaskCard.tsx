import { useState } from 'react';
import { Trash2, Edit2, Check, Calendar, Clock } from 'lucide-react';
import { Task } from '../lib/supabase';
import { TaskForm } from './TaskForm';

type TaskCardProps = {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function TaskCard({ task, onUpdate, onDelete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityColors = {
    Low: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    High: 'bg-red-100 text-red-800 border-red-200',
  };

  const statusColors = {
    Pending: 'bg-gray-100 text-gray-800 border-gray-200',
    'In Progress': 'bg-blue-100 text-blue-800 border-blue-200',
    Completed: 'bg-green-100 text-green-800 border-green-200',
  };

  const handleToggleComplete = async () => {
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    await onUpdate(task.id, { status: newStatus });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(task.id);
  };

  const handleUpdate = async (updates: Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>) => {
    await onUpdate(task.id, updates);
    setIsEditing(false);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getCompletionTime = () => {
    if (!task.completed_at) return null;
    const created = new Date(task.created_at);
    const completed = new Date(task.completed_at);
    const diffMs = completed.getTime() - created.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    if (diffDays > 0) {
      return `${diffDays}d ${diffHours}h`;
    }
    return `${diffHours}h`;
  };

  if (isEditing) {
    return (
      <div className="animate-fade-in">
        <TaskForm
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
          initialData={task}
          submitLabel="Update Task"
        />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all duration-200 hover:shadow-lg animate-fade-in ${
      isDeleting ? 'opacity-50' : ''
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={handleToggleComplete}
              disabled={isDeleting}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-all hover:scale-110 ${
                task.status === 'Completed'
                  ? 'bg-green-500 border-green-500'
                  : 'border-gray-300 hover:border-green-500'
              }`}
            >
              {task.status === 'Completed' && <Check className="w-4 h-4 text-white" />}
            </button>
            <h3 className={`text-lg font-semibold text-gray-900 ${
              task.status === 'Completed' ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
          </div>

          {task.description && (
            <p className="text-gray-600 mb-3 ml-9">{task.description}</p>
          )}

          <div className="flex flex-wrap items-center gap-2 ml-9">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}>
              {task.priority}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColors[task.status]}`}>
              {task.status}
            </span>
            {task.due_date && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                <Calendar className="w-3 h-3" />
                {formatDate(task.due_date)}
              </span>
            )}
            {task.status === 'Completed' && getCompletionTime() && (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                <Clock className="w-3 h-3" />
                {getCompletionTime()}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            disabled={isDeleting}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit task"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            title="Delete task"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
