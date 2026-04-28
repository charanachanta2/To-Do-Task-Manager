from flask import Flask, jsonify, render_template, request
import sqlite3
from pathlib import Path

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent
DB_PATH = BASE_DIR / 'database.db'


def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    with get_connection() as conn:
        conn.execute(
            '''
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                priority TEXT NOT NULL CHECK(priority IN ('High', 'Medium', 'Low')),
                status TEXT NOT NULL CHECK(status IN ('pending', 'completed'))
            )
            '''
        )
        conn.commit()


init_db()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    with get_connection() as conn:
        rows = conn.execute('SELECT * FROM tasks ORDER BY id DESC').fetchall()
    return jsonify([dict(row) for row in rows])


@app.route('/api/tasks', methods=['POST'])
def create_task():
    data = request.get_json()
    title = data.get('title', '').strip()
    priority = data.get('priority', 'Medium')
    status = data.get('status', 'pending')

    if not title:
        return jsonify({'error': 'Task title is required.'}), 400

    with get_connection() as conn:
        cursor = conn.execute(
            'INSERT INTO tasks (title, priority, status) VALUES (?, ?, ?)',
            (title, priority, status)
        )
        conn.commit()
        task_id = cursor.lastrowid
        row = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
    return jsonify(dict(row)), 201


@app.route('/api/tasks/<int:task_id>', methods=['PUT'])
def update_task(task_id):
    data = request.get_json()
    title = data.get('title', '').strip()
    priority = data.get('priority', 'Medium')
    status = data.get('status', 'pending')

    if not title:
        return jsonify({'error': 'Task title is required.'}), 400

    with get_connection() as conn:
        existing = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
        if existing is None:
            return jsonify({'error': 'Task not found.'}), 404
        conn.execute(
            'UPDATE tasks SET title = ?, priority = ?, status = ? WHERE id = ?',
            (title, priority, status, task_id)
        )
        conn.commit()
        row = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
    return jsonify(dict(row))


@app.route('/api/tasks/<int:task_id>', methods=['PATCH'])
def patch_task(task_id):
    data = request.get_json()

    with get_connection() as conn:
        row = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()
        if row is None:
            return jsonify({'error': 'Task not found.'}), 404

        title = data.get('title', row['title']).strip()
        priority = data.get('priority', row['priority'])
        status = data.get('status', row['status'])

        conn.execute(
            'UPDATE tasks SET title = ?, priority = ?, status = ? WHERE id = ?',
            (title, priority, status, task_id)
        )
        conn.commit()

        updated = conn.execute('SELECT * FROM tasks WHERE id = ?', (task_id,)).fetchone()

    return jsonify(dict(updated))


@app.route('/api/tasks/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    with get_connection() as conn:
        cursor = conn.execute('DELETE FROM tasks WHERE id = ?', (task_id,))
        conn.commit()
        if cursor.rowcount == 0:
            return jsonify({'error': 'Task not found.'}), 404
    return jsonify({'message': 'Task deleted successfully.'})


if __name__ == '__main__':
    app.run(debug=True)