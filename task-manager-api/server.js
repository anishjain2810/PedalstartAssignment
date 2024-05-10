const express = require('express');
const cors = require('cors');
const tasks = require('./tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/tasks', (req, res) => {
  res.json(tasks.getAllTasks());
});

app.post('/api/tasks', (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !description || !dueDate) {
    return res.status(400).json({ message: 'Title, description, and due date are required' });
  }

  const newTask = tasks.createTask(title, description, dueDate);
  res.status(201).json(newTask);
});

app.get('/api/tasks/:id', (req, res) => {
  const task = tasks.getTaskById(parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json(task);
});

app.put('/api/tasks/:id', (req, res) => {
  const { title, description, dueDate } = req.body;
  if (!title || !description || !dueDate) {
    return res.status(400).json({ message: 'Title, description, and due date are required' });
  }

  const updatedTask = tasks.updateTask(parseInt(req.params.id), title, description, dueDate);
  if (!updatedTask) {
    return res.status(404).json({ message: 'Task not found' });
  }

  res.json(updatedTask);
});

app.delete('/api/tasks/:id', (req, res) => {
  const deleted = tasks.deleteTask(parseInt(req.params.id));
  if (!deleted) {
    return res.status(404).json({ message: 'Task not found' });
  }
  res.json({ message: 'Task deleted' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
