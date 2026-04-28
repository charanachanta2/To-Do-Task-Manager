const taskForm = document.getElementById('taskForm');
const taskIdInput = document.getElementById('taskId');
const taskTitleInput = document.getElementById('taskTitle');
const taskPriorityInput = document.getElementById('taskPriority');
const taskStatusInput = document.getElementById('taskStatus');
const taskList = document.getElementById('taskList');
const filterTasks = document.getElementById('filterTasks');
const emptyState = document.getElementById('emptyState');
const submitBtn = document.getElementById('submitBtn');
const resetBtn = document.getElementById('resetBtn');
const messageBox = document.getElementById('messageBox');

const totalTasks = document.getElementById('totalTasks');
const completedTasks = document.getElementById('completedTasks');
const pendingTasks = document.getElementById('pendingTasks');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');

let tasks = [];

function showMessage(text, isError = false) {
  messageBox.textContent = text;
  messageBox.className = `message ${isError ? 'error' : 'success'}`;
  setTimeout(() => {
    messageBox.className = 'message hidden';
  }, 2500);
}

function resetForm() {
  taskForm.reset();
  taskIdInput.value = '';
  taskPriorityInput.value = 'Medium';
  taskStatusInput.value = 'pending';
  submitBtn.textContent = 'Add Task';
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(task => task.status === 'completed').length;
  const pending = total - completed;
  const progress = total ? Math.round((completed / total) * 100) : 0;

  totalTasks.textContent = total;
  completedTasks.textContent = completed;
  pendingTasks.textContent = pending;
  progressText.textContent = `${progress}%`;
  progressFill.style.width = `${progress}%`;
}

function getFilteredTasks() {
  const filter = filterTasks.value;
  if (filter === 'all') return tasks;
  if (filter === 'pending' || filter === 'completed') return tasks.filter(task => task.status === filter);
  return tasks.filter(task => task.priority === filter);
}

function renderTasks() {
  const filteredTasks = getFilteredTasks();
  taskList.innerHTML = '';
  emptyState.classList.toggle('hidden', filteredTasks.length > 0);

  filteredTasks.forEach(task => {
    const item = document.createElement('article');
    item.className = 'task-item';
    item.innerHTML = `
      <input class="task-check" type="checkbox" ${task.status === 'completed' ? 'checked' : ''} aria-label="Mark task complete" />
      <div>
        <h3 class="task-title ${task.status === 'completed' ? 'completed' : ''}">${task.title}</h3>
        <div class="task-meta">
          <span class="badge ${task.priority.toLowerCase()}">${task.priority}</span>
          <span class="badge ${task.status === 'completed' ? 'status' : 'pending'}">${task.status}</span>
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn edit">Edit</button>
        <button class="icon-btn delete">Delete</button>
      </div>
    `;

    item.querySelector('.task-check').addEventListener('change', () => toggleTaskStatus(task));
    item.querySelector('.edit').addEventListener('click', () => editTask(task.id));
    item.querySelector('.delete').addEventListener('click', () => removeTask(task.id));
    taskList.appendChild(item);
  });

  updateStats();
}

async function loadTasks() {
  const response = await fetch('/api/tasks');
  tasks = await response.json();
  renderTasks();
}

async function createTask(payload) {
  const response = await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Failed to create task.');
  await loadTasks();
  showMessage('Task added successfully.');
}

async function saveTask(id, payload) {
  const response = await fetch(`/api/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Failed to update task.');
  await loadTasks();
  showMessage('Task updated successfully.');
}

function editTask(id) {
  const task = tasks.find(task => task.id === id);
  if (!task) return;
  taskIdInput.value = task.id;
  taskTitleInput.value = task.title;
  taskPriorityInput.value = task.priority;
  taskStatusInput.value = task.status;
  submitBtn.textContent = 'Update Task';
  taskTitleInput.focus();
}

async function toggleTaskStatus(task) {
  const response = await fetch(`/api/tasks/${task.id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: task.status === 'completed' ? 'pending' : 'completed' })
  });
  if (!response.ok) {
    showMessage('Failed to update task status.', true);
    return;
  }
  await loadTasks();
}

async function removeTask(id) {
  const response = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  if (!response.ok) {
    showMessage('Failed to delete task.', true);
    return;
  }
  await loadTasks();
  showMessage('Task deleted successfully.');
  if (taskIdInput.value === String(id)) resetForm();
}

taskForm.addEventListener('submit', async event => {
  event.preventDefault();
  const title = taskTitleInput.value.trim();
  const priority = taskPriorityInput.value;
  const status = taskStatusInput.value;
  const editId = taskIdInput.value;
  if (!title) return;

  try {
    if (editId) {
      await saveTask(editId, { title, priority, status });
    } else {
      await createTask({ title, priority, status });
    }
    resetForm();
  } catch (error) {
    showMessage(error.message, true);
  }
});

resetBtn.addEventListener('click', resetForm);
filterTasks.addEventListener('change', renderTasks);
loadTasks();
