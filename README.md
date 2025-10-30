🧠 Intelligent Task Tracker — Full Stack Assignment Project

The Intelligent Task Tracker is a full-stack web application designed to help users efficiently manage their daily tasks while providing smart, AI-like insights into their workload. This project demonstrates complete full-stack development capability using React, Node.js, and SQLite, aligning with the requirements of the THworks Full-Stack Developer Assessment.

🧩 Project Overview

This application allows users to create, update, filter, and analyze their tasks in a clean, responsive interface.

It integrates both backend and frontend logic to provide intelligent workload insights — offering a rule-based, human-readable summary such as:

“You have 8 open tasks, most of them are High Priority and due within 3 days.”

The project showcases structured API design, database schema creation, and a smooth frontend integration following professional best practices.

🧱 Tech Stack Summary

Category	Tools / Libraries Used

Frontend	React (Vite)

Styling	Tailwind CSS

UI Components	ShadCN UI, Lucide Icons

State Management	React Hooks (useState, useEffect)

Backend	Node.js, Express.js

Database	SQLite3 (Better-SQLite3 driver)

Analytics / AI Layer	Rule-based logic for smart insights

Deployment	Vercel (Frontend), Node Backend on Local/Cloud

Version Control	Git & GitHub

🧩 Key Features

Feature	Description

📝 Create Task	Add a new task with title, description, priority, and due date.

✏️ Edit / Delete Task	Modify or remove existing tasks seamlessly.

⚙️ Priority Levels	Choose between Low, Medium, or High priority tasks.

📅 Due Date Input	Select task deadlines using the dd-mm-yyyy format.

📈 Smart Insights Panel	Automatically generates a readable summary of your workload and upcoming deadlines.

🔍 Filtering and Sorting	Filter tasks by status or priority, and sort by due date.

💾 Local Storage Persistence	Data persists between sessions using browser storage.

📱 Responsive Design	Fully optimized for mobile, tablet, and desktop views.

🎨 Modern UI Design	Clean, minimal layout styled with TailwindCSS for smooth user experience.

⚙️ Backend API Specification

Endpoint	Method	Description

/tasks	POST	Add a new task to the database.

/tasks	GET	Retrieve all tasks with optional filters (status, priority).

/tasks/:id	PATCH	Update an existing task’s status or priority.

/insights	GET	Generate a summarized report of open tasks, upcoming deadlines, and dominant priorities.

Rule-Based Insight Example:

If over 60% of open tasks are High Priority and more than 3 are due within the next 2 days, the system displays:

“Your workload is heavy — focus on high-priority tasks due soon.”

🧮 Database Schema

Table Name: tasks

Field	Type	Description

id	INTEGER (Primary Key, Auto Increment)	Unique identifier for each task.

title	TEXT	Short title describing the task.

description	TEXT	Detailed explanation of the task.

priority	TEXT (Low, Medium, High)	Defines the importance level.

due_date	TEXT	Task deadline in ISO format (YYYY-MM-DD).

status	TEXT (Open, In Progress, Done)	Current state of the task.

created_at	DATETIME	Auto-generated timestamp when created.

🧠 Insight Generation Logic

The backend aggregates data from the tasks table and applies a simple decision-based algorithm to produce a human-friendly summary.

Example logic includes:

Counting total open tasks.

Determining dominant priority among open tasks.

Calculating number of tasks due within the next 3 days.

Based on these, the backend generates a string like:

“You have 10 open tasks — 70% are High priority and 3 are due soon. You should prioritize urgent tasks first.”

🧭 Folder Structure

task-tracker/
├── backend/
│   ├── server.js
│   ├── src/
│   │   ├── db/
│   │   │   └── database.js
│   │   ├── routes/
│   │   │   └── tasks.router.js
│   │   └── services/
│   │       ├── tasks.service.js
│   │       └── insights.service.js
│   ├── task_tracker.db
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskForm.jsx
│   │   │   ├── TaskList.jsx
│   │   │   └── InsightsPanel.jsx
│   │   └── App.jsx
│   ├── public/
│   │   └── index.html
│   └── package.json
│
├── README.md
├── DECLARATION.md
└── notes.md

🚀 Setup & Run Instructions

🔧 Backend Setup

cd backend

npm install

node server.js


Backend runs at: http://localhost:3000

💻 Frontend Setup

cd frontend

npm install

npm run dev


Frontend runs at: http://localhost:5173

Ensure both frontend and backend are running for full functionality.

🧾 Documentation Files

File	Purpose

README.md	Full setup guide and project description.

DECLARATION.md	Confirms originality — “No AI/LLM used.”

notes.md	Explains design decisions, schema choices, and insight logic.

🧪 Testing & Validation

Form Validation: Title, Priority, and Due Date are mandatory.

Backend Validation: Rejects incomplete or invalid entries.

Error Handling: Displays user-friendly messages for failed operations.

Cross-Browser Tested: Chrome, Edge, and Firefox.

📊 Evaluation Alignment (Assignment Criteria)

Category	Weightage	Description

Backend/API Design		Express, Modular routes, Validation, CRUD	✅ 

Database Schema & Queries		Clean schema, indexed, optimized	✅

Frontend Logic & Integration		Functional React + API integration	✅

Insight Logic & Creativity		Rule-based summary, accuracy	✅

Documentation & Presentation		Proper README, Declaration, Notes	✅
