// src/hooks/useTasks.ts
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// ✅ Safety check for missing env vars
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables!');
  throw new Error('Supabase URL and Anon Key must be set in environment variables');
}

// ✅ Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('tasks').select('*').order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching tasks:', error);
      setError(error.message);
    } else {
      setTasks(data || []);
      setError(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTasks();

    // ✅ Real-time subscription
    const subscription = supabase
      .channel('realtime:tasks')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, (payload) => {
        console.log('Realtime update:', payload);
        fetchTasks();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return { tasks, loading, error, refresh: fetchTasks };
}

