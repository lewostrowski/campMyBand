import './App.css';

import { useState, useEffect } from 'react';

import Search from './components/Search/Search';
import Feed from './components/Feed/Feed'

function App() {
  // States
  const [serverStatus, setServerStatus] = useState(null)
  const [activeTab, setActiveTab] = useState("about")
  const [feed, setFeed] = useState({discover: [], tags: [], about: []})
  const [page, setPage] = useState({discover: null, tags: null})

  // Templates
  const navOptions = [
    ["about", "About"],
    ["discover", "Discover"],
    ["tags", "Genres explorer"]
  ]

  // Functions
  const displayComponent = () => {
    switch(activeTab) {
      case "about": 
        return <p>About</p>;
      
      case "tags": 
        return (
          <div className="content-container">
            <Search mode={activeTab} setFeed={setFeed} page={page} setPage={setPage} />
            <Feed mode={activeTab} feed={feed[activeTab]} setPage={setPage} />
          </div>
        )

      case "discover": 
        return (
          <div className="content-container">
            <Search mode={activeTab} setFeed={setFeed} page={page} setPage={setPage} />
            <Feed mode={activeTab} feed={feed[activeTab]} setPage={setPage} />
          </div>
        )
    }
  }

  // Effects
  useEffect(() => {
    fetch("http://localhost:5000/", {method: "GET"})
      .then(response => response.json())
      .then(servStat => setServerStatus(String(servStat.response)))
  }, [])

  return (
    <div>
      {/* Menu */}
      <div className="menu-container">
        {navOptions.map((option) => (
          <button
            className={`${activeTab === option[0] ? "menu-item-active" : "menu-item"}`}
            onClick={() => setActiveTab(option[0])}
          >
            {option[1]}
          </button>
        ))}
      </div>
  
      {/* Feed */}
       {serverStatus === "ok" ? (
          displayComponent()
       ) : (
         <p>No connection</p>
       )}
    </div>
  );
}

export default App;
