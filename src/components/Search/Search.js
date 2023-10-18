import { useState, useEffect } from 'react';
import Requestor from './Requestor';

function Search({ mode, setFeed, page, setPage }) {
  // States
  const [activeQuery, setActiveQuery] = useState({discover: {}, tags: {}})
  const [userQuery, setUserQuery] = useState({discover: {}, tags: {}})
  const [filterShow, setFilterShow] = useState(true)
  
  // Templates
  const sortTypes = {
    tags: [
      ["pop", "popularity"],
      ["date", "new"],
      ["random", "random"]
    ],
    discover: [
      ["top", "popularity"],
      ["new", "new"],
      ["rec", "recommended"]
    ]
  }

  const inputTemplate = {
    sort: sortTypes[mode],
    format: [
      ["all", "all"],
      ["cd", "cd"],
      ["digital", "digital"],
      ["vinyl", "vinyl"],
      ["cassette", "cassette"]
    ],
    tags: null,
    depth: null,
    rcsort: [
      ["most", "most recommended"],
      ["latest", "latest recommendation"]
    ]
  }

  const fieldsTemplate = {
    sort: "sort", 
    format: "format",
    depth: "page",
    tags: "genres", 
    rcsort: "recommendation"
  }

  const defaultTemplate = {
    tags: {
      sort: "date",
      format: "digital",
      tags: null,
      depth: 1 
    },
    discover: {
      sort: "new",
      format: "digital",
      depth: 0,
      tags: null,
      rcsort: "most"
    }
  }

  // Functions
  const handleInput = (e) => {
    const k = e.target.name
    const v = e.target.value 
    
    let current = userQuery[mode]
    current[k] = v
    setUserQuery(prev => ({...prev, [mode]: current}))
  }

  const defaultFilters = () => {
    let newFilters = {}
    for (let k in defaultTemplate[mode]) {
      if (Object.keys(userQuery[mode]).includes(k)) {
        newFilters[k] = k !== "depth" ? userQuery[mode][k] : page[mode] 
      } else {
        newFilters[k] = defaultTemplate[mode][k]
      }
    }
    console.log(newFilters)
    return newFilters
  }
  
  // Effects
  useEffect(() => {
    console.log(page[mode])
    if (page[mode] !== null) {
      if (Object.keys(userQuery[mode]).includes("tags") || mode === "discover") {
        const req = new Requestor(mode, defaultFilters())
        req.makeReq()
          .then(body => {
            setFeed(prev => ({...prev, [mode]: body}))
            setActiveQuery(prev => ({...prev, [mode]: defaultFilters()}))
            setUserQuery(prev => ({...prev, [mode]: defaultFilters()}))
          })
      }
    }
  }, [page])

  return (
  <div className="filters-container">
      <div className="filters-btn">
        <button onClick={() => setFilterShow(!filterShow)}>
          {filterShow ? "hide filters" : "show filters"}
        </button>
      </div>

      {/* Current filters */}
      <div className="filters-current" style={{ display: filterShow ? "" : "none"}}>
        <h3>Active filters</h3>
        <ul>
          {Object.keys(activeQuery[mode]).map((key) => (
            <li>
              <span className="filter-key">{fieldsTemplate[key]}</span>
              <span className="filter-val">
                {/* Match active filters with human-readable names */}
                {inputTemplate[key] !== null ? (
                  inputTemplate[key].map((item) => (item[0] === activeQuery[mode][key] ? item[1] : null))
                ) : (
                  activeQuery[mode][key]
                )}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Filters input fileds */}
      <div className="filters-input" style={{ display: filterShow ? "" : "none" }}>
        <h3>Filters settings</h3>
        {Object.keys(inputTemplate).map((key) => (
          (inputTemplate[key] !== null ? (
            // Dropdown fields
            <div className="dropdown-input">
              <label>{fieldsTemplate[key]}</label>
              <select name={key} onChange={handleInput}>
                {inputTemplate[key].map((item) => (
                  <option value={item[0]}>{item[1]}</option>
                ))}
              </select>
            </div>
          ) : (
            // Text input fields
            <div className="field-input">
              <label>{fieldsTemplate[key]}</label>
              <input name={key} type="text" onChange={handleInput} />
            </div>
          ))
        ))}
        <button onClick={() => { 
          let newPage = mode === "tags" ? 1 : 0
          setPage(prev => ({...prev, [mode]: newPage}))
        }}>search</button>
      </div>

  </div>
  );
}

export default Search;
