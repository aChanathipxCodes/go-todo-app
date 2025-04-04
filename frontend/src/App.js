import React, { useState, useEffect } from "react";
import "./App.css";

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");

  // ดึงข้อมูลจาก API
  const loadTasks = async () => {
    try {
      const response = await fetch("http://localhost:8080/tasks");
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // ฟังก์ชันเพิ่มงานใหม่
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

  // ฟังก์ชันเปลี่ยนสถานะของงาน
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

  // ฟังก์ชันลบงาน
  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8080/tasks/${taskId}`, {
        method: "DELETE",
      });
      if (response.ok) {
        // ลบ task ที่มี id ตรงกับ taskId ออกจาก array tasks
        setTasks(tasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
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
        <button onClick={addTask}>เพิ่มงาน</button>
      </div>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} className={`task-item ${task.done ? "done" : ""}`}>
            <span className="task-text">{task.text}</span>
            <button
              className="delete-btn"
              onClick={() => deleteTask(task.id)} // ส่ง id ของ task ที่จะลบ
            >
              ลบ
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
