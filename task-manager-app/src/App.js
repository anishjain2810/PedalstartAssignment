import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', dueDate: '' });
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: '', description: '', dueDate: '' });

  useEffect(() => {
    axios.get('http://localhost:5000/api/tasks')
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    if (editingTask) {
      setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
    } else {
      setNewTask({ ...newTask, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (editingTask) {
      axios.put(`http://localhost:5000/api/tasks/${editingTask.id}`, editedTask)
        .then(res => {
          setTasks(tasks.map(task => (task.id === res.data.id ? res.data : task)));
          setEditingTask(null);
          setEditedTask({ title: '', description: '', dueDate: '' });
        })
        .catch(err => console.error(err));
    } else {
      axios.post('http://localhost:5000/api/tasks', newTask)
        .then(res => {
          setTasks([...tasks, res.data]);
          setNewTask({ title: '', description: '', dueDate: '' });
        })
        .catch(err => console.error(err));
    }
  };

  const deleteTask = id => {
    axios.delete(`http://localhost:5000/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter(task => task.id !== id)))
      .catch(err => console.error(err));
  };

  const startEditing = task => {
    setEditingTask(task);
    setEditedTask({ ...task });
  };

  const cancelEditing = () => {
    setEditingTask(null);
    setEditedTask({ title: '', description: '', dueDate: '' });
  };

  return (
    <div className="container">
      <h1 className='title'>Task Management Application</h1>
      <form className="task-form" onSubmit={handleSubmit}>
        <input className="input" type="text" name="title" value={editingTask ? editedTask.title : newTask.title} onChange={handleChange} placeholder="Title" required />
        <input className="input" type="text" name="description" value={editingTask ? editedTask.description : newTask.description} onChange={handleChange} placeholder="Description" required />
        <input className="input" type="date" name="dueDate" value={editingTask ? editedTask.dueDate : newTask.dueDate} onChange={handleChange} required />
        {editingTask ? (
          <div className='btn-container'>
            <button className="btn1" type="submit">Save Changes</button>
            <button className="btn2" type="button" onClick={cancelEditing}>Cancel</button>
          </div>
        ) : (
          <button className="btn-submit" type="submit">Add Task</button>
        )}
      </form>
      <ul className="task-list">
        {tasks.map(task => (
          <li key={task._id} className="task-item">
            <h2 className='task-title'>{task.title}</h2>
            <p>{task.description}</p>
            <p>Due Date: {new Date(task.dueDate).toLocaleDateString()}</p>
            <div>
              <button className="btn-delete" onClick={() => deleteTask(task.id)}>Delete</button>
              <button className="btn-edit" onClick={() => startEditing(task)}>Edit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;





