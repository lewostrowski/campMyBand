package search

import (
  "bytes"
  "encoding/json"
  "net/http"
  "time"
  "fmt"
) 

type PostRequest struct {
  Filters Filters `json:"filters"`
  Page int `json:"page"` 
}

type Filters struct {
  Sort string `json:"sort"`
  Format string `json:"format"`
  Tags []string `json:"tags"`
  Location int `json:"location"`
}

// User search query send in body via POST request.
type TagsQuery struct {
  Sort string
  Format string
  Tags []string
  Depth int
  Location int
}

// Result of GET request from /discovery endpoint.
type TagsLs struct {
  Items []TagsID
}

type TagsID struct {
  Item_id int
  Tralbum_type string
  Band_id int
}

func ReturnTags(query TagsQuery) TagsLs {
  burl := "https://bandcamp.com/api/hub/2/dig_deeper"
  
  client = &http.Client{Timeout: 10 * time.Second}
  tags := post_tags(burl, query)
  return tags 
}

func post_tags(burl string, q TagsQuery) TagsLs {
  message := PostRequest{Filters{q.Sort, q.Format, q.Tags, q.Location}, q.Depth}
  post_body, err_m := json.Marshal(message)
  
  if err_m != nil {
    panic(err_m)
  }
  fmt.Println(string(post_body))
  resp, err_post := client.Post(burl, "application/json", bytes.NewBuffer(post_body))
  if err_post != nil {
    panic(err_post)
  }

  defer resp.Body.Close()

  var tagslist TagsLs
  if err_j := json.NewDecoder(resp.Body).Decode(&tagslist); err_j != nil {
    panic(err_j)
  }
  fmt.Println(tagslist)
  return tagslist
}
