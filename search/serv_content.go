package search

import (
  "encoding/json"
  "strconv"
)

type Album struct {
  Id int `json:"id"`
  Title string `json:"title"`
  Bandcamp_url string `json:"bandcamp_url"`
  Band Band `json:"band"`
  About string `json:"about"`
  Featured_track_id int `json:"featured_track_id"`
  Release_date int `json:"release_date"`
//  Is_purchasable bool `json:"is_purchasable"`
  Free_download bool `json:"free_download"`
  Is_preorder bool `json:"is_preorder"`
  Tags []Tags `json:"tags"`
  Currency string `json:"currency"`
//  Is_set_price bool `json:"is_set_price"`
  Price float64 `json:"price"`
  Label string `json:"label"`
  Num_downloadable_tracks int `json:"num_downloadable_tracks"`
}

type Band struct {
  Name string `json:"name"`
  Bio string `json:"bio"`
  Location string `json:"location"`
}

type Tags struct {
  Name string `json:"name"`
  Norm_name string `json:"norm_name"`
}

func ServeDisco(query DiscoQuery) string {
  var collection []Album 
  ls := ReturnDisco(query)
  for _, it := range ls.Items {
      album := get_album(it.Id, it.Band_id, it.Type)
      collection = append(collection, album)
  }
  response, err_j := json.Marshal(collection)
  if err_j != nil {
    panic(err_j)
  }
  return string(response)
}

func ServeTags(query TagsQuery) string {
  var collection []Album 
  ls := ReturnTags(query)
  
  for _, it := range ls.Items {
      album := get_album(it.Item_id, it.Band_id, it.Tralbum_type)
      collection = append(collection, album)
  }
  response, err_j := json.Marshal(collection)
  if err_j != nil {
    panic(err_j)
  }
  return string(response) 
}

func get_album(id int, band_id int, tralbum_type string) Album {
  burl := "https://bandcamp.com/api/mobile/24/tralbum_details?"
  burl += "tralbum_id=" + strconv.Itoa(id) 
  burl += "&band_id=" + strconv.Itoa(band_id)
  burl += "&tralbum_type=" + tralbum_type

  resp, err_get := client.Get(burl)
  if err_get != nil {
    panic(err_get)
  }

  defer resp.Body.Close()
  
  var alb Album
  if err_j := json.NewDecoder(resp.Body).Decode(&alb); err_j != nil {
    panic(err_j)
  }

  return alb
}
