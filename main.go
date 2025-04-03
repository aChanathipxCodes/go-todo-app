package main

import (
	"net/http"

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

	// ดึงงานทั้งหมด
	r.GET("/tasks", func(c *gin.Context) {
		c.JSON(http.StatusOK, tasks)
	})

	// เพิ่มงานใหม่
	r.POST("/tasks", func(c *gin.Context) {
		var newTask Task
		if err := c.BindJSON(&newTask); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
			return
		}
		newTask.ID = len(tasks) + 1
		tasks = append(tasks, newTask)
		c.JSON(http.StatusOK, newTask)
	})

	r.Run(":8080") // รันเซิร์ฟเวอร์ที่พอร์ต 8080
}
