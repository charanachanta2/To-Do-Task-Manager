# To-Do Task Manager

A beginner-friendly Flask CRUD project for managing daily tasks with priorities, completion tracking, filtering, and persistent storage using SQLite. Flask commonly uses a `templates` folder for HTML and a `static` folder for CSS and JavaScript, which is the structure used in this project.[1][2]

## Project overview

This app helps a user add tasks, view saved tasks, edit them, mark them as completed, and delete them when they are no longer needed. These actions match the standard CRUD pattern: Create, Read, Update, and Delete.[3]

The project has a Flask backend and a browser-based frontend. The frontend sends requests with JavaScript `fetch()` and receives JSON responses from Flask routes, while SQLite stores the task data locally on the machine running the app.[4][3]

## Features

- Add a new task with a title, priority, and status.[3]
- Display all saved tasks from the database.[3]
- Edit an existing task.[3]
- Delete a task from the list.[3]
- Mark tasks as pending or completed.[3]
- Filter tasks by status or priority in the UI.[3]
- Show total, completed, pending, and percentage progress in the dashboard.[3]

## Folder structure

```text
todo-task-manager/
├── app.py
├── database.db
├── requirements.txt
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   └── script.js
└── README.md
```

Flask looks for template files inside `templates/` and serves CSS and JavaScript from `static/` by default, so keeping the files in these folders is important for the app to work correctly.[1][5]

## How the app works

### 1. Frontend form

The user enters a task title, selects a priority, chooses the task status, and clicks **Add Task**. JavaScript reads the form values and sends them to the backend as JSON using `fetch()`.[4][6]

### 2. Flask API

The Flask backend receives the request through routes such as `/api/tasks` and `/api/tasks/<id>`. It uses `jsonify()` to return JSON responses that the frontend can read and display.[4][3]

### 3. SQLite database

Task records are stored in `database.db`. SQLite is a good fit for small projects like this because it stores data in a single file and works well for local CRUD practice.[3]

### 4. UI rendering

After adding, editing, deleting, or updating a task, the frontend calls the API again to load the latest task list. It then redraws the task cards and updates the total, completed, pending, and progress bar values.[3]

## API routes used

| Route | Method | Purpose |
|---|---|---|
| `/` | GET | Loads the main HTML page.[1] |
| `/api/tasks` | GET | Returns all tasks as JSON.[3] |
| `/api/tasks` | POST | Creates a new task.[3] |
| `/api/tasks/<task_id>` | PUT | Updates an existing task completely.[3] |
| `/api/tasks/<task_id>` | PATCH | Updates part of a task, such as status.[3] |
| `/api/tasks/<task_id>` | DELETE | Deletes a task.[3] |

## Installation steps

### 1. Create the project folder

Create the folders and files using the structure shown above. The `templates` and `static` folders must be named correctly for Flask’s default behavior.[1][2]

### 2. Add the requirements file

Create a file named `requirements.txt` with this content:

```txt
Flask>=3.1,<3.2
```

Flask needs to be installed through `pip`, while `sqlite3` is part of Python’s standard library and does not need a separate package.[7]

### 3. Install dependencies

Run:

```bash
pip install -r requirements.txt
```

### 4. Start the app

Run:

```bash
python app.py
```

Then open this URL in your browser:

```text
http://127.0.0.1:5000
```

## Important files explained

### `app.py`

This is the main backend file. It creates the Flask app, connects to SQLite, creates the `tasks` table if it does not exist, and defines all routes for loading, creating, editing, updating, and deleting tasks.[3]

### `templates/index.html`

This file contains the page structure for the app, including the form, task list, filter, and progress section. Flask renders this file when the user visits the home route.[1][2]

### `static/style.css`

This file controls the app’s design, colors, layout, task cards, progress bar, and responsive styling for smaller screens.[2]

### `static/script.js`

This file handles user interaction in the browser. It reads form data, sends API requests using `fetch()`, updates the task list, and refreshes the progress summary after each action.[4][6]

## Common issues and fixes

### Tasks are not showing after clicking Add Task

Check that the JavaScript file is loaded only once and not duplicated both as an external file and again in an inline `<script>` block. Running the same frontend logic twice can cause broken event handling and rendering issues.[4]

Check that the API request is successful in the browser’s Network tab. If `POST /api/tasks` fails, the list will not refresh because the frontend depends on reloading data from the backend after task creation.[3]

Check that your database initialization runs before the first request so the `tasks` table exists. If the table is missing, inserts will fail and no tasks will appear.[3]

### CSS variables not working

Use `:root` in CSS, not `style:root`. The `:root` pseudo-class is the correct selector for defining CSS custom properties at the document root.[8]

### Static files are not loading

Make sure your HTML is inside the `templates` folder and your CSS and JavaScript files are inside the `static` folder. Flask expects this layout by default.[1][2]

## Future improvements

This project can be extended with more productivity features such as due dates, categories, search, login support, and syncing to a remote database. The current structure is a strong beginner foundation because it already demonstrates frontend-backend communication, API routes, and database-backed CRUD operations.[3]
