import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editText, setEditText] = useState("");

  const loadTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  const addTask = async () => {
    if (!taskText.trim()) return;
    const newTask = { text: taskText, done: false };
    try {
      const response = await fetch("http://localhost:8080/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        setTaskText("");
        loadTasks();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const toggleTaskDone = async (taskId, currentStatus) => {
    const updatedTask = { done: !currentStatus };
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        loadTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        loadTasks();
      }
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const startEditing = (taskId, currentText) => {
    setEditingTaskId(taskId);
    setEditText(currentText);
  };

  const confirmEdit = async (taskId) => {
    const updatedTask = { text: editText };
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      if (response.ok) {
        setEditingTaskId(null);
        loadTasks();
      }
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="app-container">
      <h1>To-Do List</h1>
      <div className="input-container">
        <input
          type="text"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          placeholder="เพิ่มงานใหม่"
        />
        <button className="add-btn" onClick={addTask}>เพิ่มงาน</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <div className="task-content">
              <span className="task-id">{task.id}.</span>
              {editingTaskId === task.id ? (
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
              ) : (
                <span className="task-text">{task.text}</span>
              )}
            </div>
            <div className="task-buttons">
              {editingTaskId === task.id ? (
                <button className="confirm-btn" onClick={() => confirmEdit(task.id)}>ตกลง</button>
              ) : (
                <button className="edit-btn" onClick={() => startEditing(task.id, task.text)}>แก้ไข</button>
              )}
              <button className="delete-btn" onClick={() => deleteTask(task.id)}>ลบ</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
