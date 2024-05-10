const fs = require('fs');
const path = require('path');

const tasksFilePath = path.join(__dirname, 'tasks.json');

let tasks = [];

const loadTasks = () => {
  try {
    const data = fs.readFileSync(tasksFilePath);
    tasks = JSON.parse(data);
  } catch (error) {
    console.error('Error loading tasks:', error.message);
  }
};

const saveTasks = () => {
  try {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error('Error saving tasks:', error.message);
  }
};

const getAllTasks = () => tasks;

const getTaskById = (id) => tasks.find(task => task.id === id);

const createTask = (title, description, dueDate) => {
  const newTask = { id: tasks.length + 1, title, description, dueDate };
  tasks.push(newTask);
  saveTasks();
  return newTask;
};

const updateTask = (id, title, description, dueDate) => {
  const taskIndex = tasks.findIndex(task => task.id === id);
  if (taskIndex === -1) {
    return null;
  }

  tasks[taskIndex] = { id, title, description, dueDate };
  saveTasks();
  return tasks[taskIndex];
};

const deleteTask = (id) => {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  if (tasks.length !== initialLength) {
    saveTasks();
    return true;
  }
  return false;
};

loadTasks();

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
};