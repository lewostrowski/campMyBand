class Requestor {
  constructor(mode, query) {
    this.mode = mode;
    this.query = query;
  }

  genBody() {
    let newBody = {}

    for (let k in this.query) {
      var val = this.query[k]

      if (k === "tags" && val !== null) {
        val = val.replace(/, +/g, ",").replace(" ", "-") 
       
        if (this.mode === "tags") {
          val = val.split(",")
        }
      }   
      newBody = Object.assign({[k]: val}, newBody)
    }

    return newBody
  }
  
  async makeReq() {
    let feed = await fetch(`http://localhost:5000/${this.mode}`, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(this.genBody())
    })
      .then(response => response.json()) 
      .then(body => {
        if (this.mode === "discover") {
          return JSON.parse(body)
        } else {
          return JSON.parse(body.response)
        }
      })
    return feed
  }
}

export default Requestor;
