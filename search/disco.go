package search

import (
  "encoding/json"
  "net/http"
  "strconv"
  "time"
) 

var client *http.Client

// User search query send in body via POST request.
type DiscoQuery struct {
  Sort string
  Format string
  Tags string
  Depth int
  Rcsort string
}

// Result of GET request from /discovery endpoint.
type DiscoLs struct {
  Items []DiscoID
}

type DiscoID struct {
  Id int
  Type string
  Band_id int
}

func ReturnDisco(query DiscoQuery) DiscoLs {
  burl := "https://bandcamp.com/api/discover/3/get?"

  if query.Sort != "" {
    burl += "&s=" + query.Sort
  }
  if query.Format != "" {
    burl += "&f=" + query.Format
  }
  if query.Tags != "" {
    burl += "&t=" + query.Tags
  }
  if query.Depth > 0 {
    burl += "&p=" + strconv.Itoa(query.Depth)
  }
  if query.Rcsort != "" {
    burl += "&r=" + query.Rcsort
  }

  client = &http.Client{Timeout: 10 * time.Second}
  disco := get_disco(string(burl))
  return disco
}

func get_disco(burl string) DiscoLs {
  resp, err_get := client.Get(burl)
  if err_get != nil {
    panic(err_get)
  }

  defer resp.Body.Close()
  
  var discolist DiscoLs
  if err_j := json.NewDecoder(resp.Body).Decode(&discolist); err_j != nil {
    panic(err_j)
  }
  
  return discolist
}
