package main

import (
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Task struct {
	ID   int    `json:"id"`
	Text string `json:"text"`
}

var tasks = []Task{
	{ID: 1, Text: "เรียน Go"},
	{ID: 2, Text: "สร้างเว็บด้วย React"},
}

func main() {
	r := gin.Default()
	r.Use(cors.Default())

	r.GET("/tasks", func(c *gin.Context) {
		c.JSON(200, tasks)
	})

	r.POST("/tasks", func(c *gin.Context) {
		var newTask Task
		if err := c.BindJSON(&newTask); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		newTask.ID = len(tasks) + 1
		tasks = append(tasks, newTask)
		c.JSON(200, newTask)
	})

	r.PATCH("/tasks/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		var updatedTask Task
		if err := c.BindJSON(&updatedTask); err != nil {
			c.JSON(400, gin.H{"error": err.Error()})
			return
		}
		for i, task := range tasks {
			if task.ID == id {
				tasks[i].Text = updatedTask.Text
				c.JSON(200, tasks[i])
				return
			}
		}
		c.JSON(404, gin.H{"error": "Task not found"})
	})

	r.DELETE("/tasks/:id", func(c *gin.Context) {
		id, _ := strconv.Atoi(c.Param("id"))
		for i, task := range tasks {
			if task.ID == id {
				tasks = append(tasks[:i], tasks[i+1:]...)
				c.JSON(200, gin.H{"message": "Task deleted"})
				return
			}
		}
		c.JSON(404, gin.H{"error": "Task not found"})
	})

	r.Run(":8080")
}
