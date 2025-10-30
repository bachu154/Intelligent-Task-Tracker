import { useState, useEffect } from 'react'
import { supabase, Task } from '../lib/supabase'

type TaskInsert = Omit<Task, 'id' | 'created_at' | 'updated_at' | 'completed_at'>

/**
 * Custom React hook for managing tasks with Supabase.
 * Includes fetch, create, update, delete, and error handling.
 */
export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 🔹 Fetch tasks from Supabase
  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError(null)

      // ✅ Ensure Supabase client is initialized
      if (!supabase) {
        throw new Error('Supabase client not initialized. Check environment variables.')
      }

      const { data, error: fetchError } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false })

      if (fetchError) throw fetchError
      setTasks(data || [])
    } catch (err) {
      console.error('❌ Error fetching tasks:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks')
    } finally {
      setLoading(false)
    }
  }

  // 🔹 Create new task
  const createTask = async (taskData: TaskInsert) => {
    try {
      const { data, error: createError } = await supabase
        .from('tasks')
        .insert([taskData])
        .select()
        .single()

      if (createError) throw createError

      setTasks(prev => [data, ...prev])
      return { success: true, data }
    } catch (err) {
      console.error('❌ Error creating task:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to create task',
      }
    }
  }

  // 🔹 Update task
  const updateTask = async (id: string, updates: Partial<Task>) => {
    try {
      const { data, error: updateError } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      setTasks(prev => prev.map(task => (task.id === id ? data : task)))
      return { success: true, data }
    } catch (err) {
      console.error('❌ Error updating task:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update task',
      }
    }
  }

  // 🔹 Delete task
  const deleteTask = async (id: string) => {
    try {
      const { error: deleteError } = await supabase.from('tasks').delete().eq('id', id)
      if (deleteError) throw deleteError

      setTasks(prev => prev.filter(task => task.id !== id))
      return { success: true }
    } catch (err) {
      console.error('❌ Error deleting task:', err)
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to delete task',
      }
    }
  }

  // 🔹 Fetch on mount
  useEffect(() => {
    fetchTasks()
  }, [])

  return {
    tasks,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks: fetchTasks,
  }
}

