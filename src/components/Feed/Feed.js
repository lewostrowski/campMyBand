import { useState, useEffect } from 'react';

function Feed({ mode, feed, setPage }) {
  // States
  const [leaf, setLeaf] = useState(0)

  const createSrc = (album_id, track_id) => {
    var base = "https://bandcamp.com/EmbeddedPlayer"
    var props = `album=${album_id}`
    var style = "size=large/bgcol=ffffff/linkcol=0687f5"
    var track = `track=${track_id}`
    var last = "transparent=true/ seamless"

    return `${base}/${props}/${style}/${track}/${last}` 
  } 

  const convertUnix = (unix) => {
    var d = new Date(unix * 1000)
    var month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1
    var day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate()
    return `${d.getFullYear()}-${month}-${day}` 
  }

  const showAbout = (name, album_id) => {
    const element = document.getElementById(`${name}-${album_id}`)
    element.style.display = element.style.display !== "" ? "" : "none"

    const counterName = name === "artist" ? "album" : "artist"
    const counterElement = document.getElementById(`${counterName}-${album_id}`)
    counterElement.style.display = "none"
  }

  const genControlPanel = () => {
    console.log(mode)
    if (feed.length > 0) {
    return (
       <div className="control-container">
         <button onClick={() => setPage(prev => ({...prev, [mode]: prev[mode] - 1}))}>Prev page</button>
         
         <div className="leaf-container">
           {[...Array(Math.ceil(feed.length/10)).keys()].map((l) => (
             (l === leaf ? (
               <button className="leaf-btn-active" onClick={() => setLeaf(l)}></button>         
             ) : (
               <button className="leaf-btn" onClick={() => setLeaf(l)}></button> 
             ))
           ))}
         </div>
         
         <button onClick={() => setPage(prev => ({...prev, [mode]: prev[mode] + 1}))}>Next page</button>
       </div> 
     )
    } else {
      return null
    }
  }

  // Effects
  useEffect(() => {setLeaf(0)}, [feed])

  return (
    <div>

      {genControlPanel()}

      <div className="feed-container">
         {feed.slice(leaf * 10, (leaf + 1) * 10).map((album) => (
          <div className="feed-item">
            
            <div className="feed-item-src">
             <iframe 
              style={{border: 0, width: 350 + 'px', height: 522 + 'px'}} 
              src={createSrc(album.id, album.featured_track_id)}
              ></iframe>
             </div>

            <div className="feed-item-desc">
              <h3>{album.title} {album.is_preorder ? "(preorder)" : ""}</h3>
              <h4>
                by <span className="subtitle">{album.band.name}</span>
                from <span className="subtitle">{album.band.location}</span>
              </h4>
             
              <p>release<span className="item-key">{convertUnix(album.release_date)}</span></p>
              <p>price 
                <span className="item-key">
                  {album.price > 0 ? `${album.price} ${album.currency}` : "name your pice"} 
                </span>
                <span className="item-key">
                  {album.free_download ? "(free download)" : ""}
                </span>
              </p>

              <ul>{album.tags.map((t) => (<li>{t.name}</li>))}</ul>

              <p>about
                <span 
                  className="item-key"
                  style={{ display: `${album.band.about !== "" ? "" : "none"}` }}
                  onClick={() => showAbout("artist", album.id)}
                >artist</span>
                <span 
                  className="item-key"
                  style={{ display: `${album.about !== "" ? "" : "none"}` }}
                  onClick={() => showAbout("album", album.id)}
                >album</span>
              </p>

              <p id={`artist-${album.id}`} style={{ display: "none" }}>{album.band.bio}</p>
              <p id={`album-${album.id}`} style={{ display: "none" }}>{album.about}</p>
              
            </div>
          </div>
         ))} 
       </div>

      {genControlPanel()}
    </div>
  )
}

export default Feed;
