/*
  # Create tasks table for Task Tracker application

  1. New Tables
    - `tasks`
      - `id` (uuid, primary key) - Unique task identifier
      - `title` (text, required) - Task title
      - `description` (text, optional) - Detailed task description
      - `priority` (text, required) - Task priority: Low, Medium, or High
      - `due_date` (date, optional) - When the task is due
      - `status` (text, required) - Task status: Pending, In Progress, or Completed
      - `created_at` (timestamptz) - When task was created
      - `updated_at` (timestamptz) - When task was last updated
      - `completed_at` (timestamptz, optional) - When task was marked completed
  
  2. Security
    - Enable RLS on `tasks` table
    - Add policies for public access (no auth required for this demo)
    - SELECT policy: Anyone can view all tasks
    - INSERT policy: Anyone can create tasks
    - UPDATE policy: Anyone can update tasks
    - DELETE policy: Anyone can delete tasks

  3. Important Notes
    - This demo allows public access for simplicity
    - Timestamps are automatically managed
    - Priority values are constrained to Low, Medium, High
    - Status values are constrained to Pending, In Progress, Completed
*/

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  priority text NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date date,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'In Progress', 'Completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS tasks_status_idx ON tasks(status);
CREATE INDEX IF NOT EXISTS tasks_priority_idx ON tasks(priority);
CREATE INDEX IF NOT EXISTS tasks_due_date_idx ON tasks(due_date);

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read tasks
CREATE POLICY "Anyone can view tasks"
  ON tasks FOR SELECT
  USING (true);

-- Allow anyone to create tasks
CREATE POLICY "Anyone can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update tasks
CREATE POLICY "Anyone can update tasks"
  ON tasks FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete tasks
CREATE POLICY "Anyone can delete tasks"
  ON tasks FOR DELETE
  USING (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  
  -- Auto-set completed_at when status changes to Completed
  IF NEW.status = 'Completed' AND OLD.status != 'Completed' THEN
    NEW.completed_at = now();
  END IF;
  
  -- Clear completed_at if status changes away from Completed
  IF NEW.status != 'Completed' AND OLD.status = 'Completed' THEN
    NEW.completed_at = NULL;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();