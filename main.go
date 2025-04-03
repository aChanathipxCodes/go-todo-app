package main

import (
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
	r.Use(cors.Default()) // ใช้การตั้งค่า CORS แบบ default

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

	r.Run(":8080") // Run on port 8080
}
