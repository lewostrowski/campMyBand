package main

import (
  "net/http"

  "github.com/gin-gonic/gin"
  "github.com/gin-contrib/cors"
  "github.com/lewostrowski/GoBandScrap/search"
)

func main() {
  r := gin.Default()
  r.Use(cors.Default())

  r.GET("/", func(c *gin.Context) {
    c.JSON(http.StatusOK, gin.H{"response": "ok"})
  })

  // Params in body
  r.POST("/tags", func(c *gin.Context){
    var query search.TagsQuery
    if err := c.ShouldBindJSON(&query); err != nil {
      c.JSON(http.StatusOK, gin.H{"response": "error"})
    }
    c.JSON(http.StatusOK, gin.H{"response": search.ServeTags(query)})
  })

  // Params in url 
  r.POST("/discover", func(c *gin.Context){
    var query search.DiscoQuery
    if err := c.ShouldBindJSON(&query); err != nil {
      c.JSON(http.StatusOK, gin.H{"response": "error"})
    }
    c.JSON(http.StatusOK, search.ServeDisco(query))
  })

  r.Run(":5000")
}
