package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

type Task struct {
	ID   int    `json:"id"`
	Text string `json:"text"`
	Done bool   `json:"done"`
}

var tasks = []Task{
	{ID: 1, Text: "เรียน Go", Done: false},
	{ID: 2, Text: "สร้างเว็บด้วย React", Done: false},
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
		tasks = append(tasks, newTask)
		c.JSON(200, newTask)
	})

	r.DELETE("/tasks/:id", func(c *gin.Context) {
		idStr := c.Param("id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
			return
		}

		for i, task := range tasks {
			if task.ID == id {
				tasks = append(tasks[:i], tasks[i+1:]...)
				c.JSON(http.StatusOK, gin.H{"message": "Task deleted successfully"})
				return
			}
		}

		c.JSON(http.StatusNotFound, gin.H{"message": "Task not found"})
	})

	r.Run(":8080")
}
