import { useState, useEffect } from 'react';
import { useTasks } from './hooks/useTasks';
import { TaskForm } from './components/TaskForm';
import { TaskCard } from './components/TaskCard';
import { InsightsDashboard } from './components/InsightsDashboard';
import { FilterBar } from './components/FilterBar';
import { Toast } from './components/Toast';
import { ListTodo, Loader, AlertCircle } from 'lucide-react';

type ToastState = {
  message: string;
  type: 'success' | 'error';
} | null;

function App() {
  const { tasks, loading, error, createTask, updateTask, deleteTask } = useTasks();
  const [toast, setToast] = useState<ToastState>(null);
  const [statusFilter, setStatusFilter] = useState(() => {
    return localStorage.getItem('statusFilter') || 'All';
  });
  const [priorityFilter, setPriorityFilter] = useState(() => {
    return localStorage.getItem('priorityFilter') || 'All';
  });

  useEffect(() => {
    localStorage.setItem('statusFilter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('priorityFilter', priorityFilter);
  }, [priorityFilter]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleCreateTask = async (taskData: any) => {
    const result = await createTask(taskData);
    if (result.success) {
      showToast('Task created successfully!', 'success');
    } else {
      showToast(result.error || 'Failed to create task', 'error');
    }
  };

  const handleUpdateTask = async (id: string, updates: any) => {
    const result = await updateTask(id, updates);
    if (result.success) {
      showToast('Task updated successfully!', 'success');
    } else {
      showToast(result.error || 'Failed to update task', 'error');
    }
  };

  const handleDeleteTask = async (id: string) => {
    const result = await deleteTask(id);
    if (result.success) {
      showToast('Task deleted successfully!', 'success');
    } else {
      showToast(result.error || 'Failed to delete task', 'error');
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter;
    return matchesStatus && matchesPriority;
  });

  const lastUpdated = tasks.length > 0
    ? new Date(Math.max(...tasks.map(t => new Date(t.updated_at).getTime()))).toLocaleString()
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <ListTodo className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">Task Tracker</h1>
                <p className="text-gray-600 mt-1">Organize your work with intelligent insights</p>
              </div>
            </div>
            {lastUpdated && (
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-700">{lastUpdated}</p>
              </div>
            )}
          </div>
        </header>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-medium text-red-900">Failed to fetch tasks</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Fetching tasks...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <InsightsDashboard tasks={tasks} />
            </div>

            <div className="mb-6">
              <TaskForm onSubmit={handleCreateTask} />
            </div>

            {tasks.length > 0 && (
              <div className="mb-6">
                <FilterBar
                  statusFilter={statusFilter}
                  priorityFilter={priorityFilter}
                  onStatusChange={setStatusFilter}
                  onPriorityChange={setPriorityFilter}
                />
              </div>
            )}

            <div className="space-y-4">
              {filteredTasks.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ListTodo className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {tasks.length === 0 ? 'No tasks yet' : 'No matching tasks'}
                  </h3>
                  <p className="text-gray-600">
                    {tasks.length === 0
                      ? 'Create one to get started!'
                      : 'Try adjusting your filters to see more tasks.'}
                  </p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
