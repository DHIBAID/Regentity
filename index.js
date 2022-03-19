const express = require("express")
const app = express()
const ejs = require("ejs")
const path = require("path")
const Database = require("@replit/database")
const db = new Database()
const multer = require("multer")
const upload = multer({ dest: __dirname + "/data" })
const fs = require("fs")

app.set("view engine", "ejs")
ejs.openDelimiter = "|"
ejs.closeDelimiter = "|"
ejs.delimiter = "?"

app.get("/", function(req, res) {
  let data
  (function() {
    data = fs.readFileSync(__dirname + "/public/db.json", { encoding: "utf-8" })
    
  })()
  res.render(__dirname + "/public/home", { posts: data, filter: null })
})

app.get("/about", function(req, res) {
  res.render(__dirname + "/public/about.ejs")
})

app.get("/make-a-post", function(req, res) {
  res.render(__dirname + "/public/make-a-post.ejs")
})

app.post("/create", upload.none(), function(req, res) {
  
  data = JSON.parse(fs.readFileSync(__dirname + "/public/db.json", { encoding: "utf-8" })) || []

  let date_var = new Date().toString()
  date_var = date_var.split(" ")
  date = `${date_var[1]} ${date_var[2]}, ${date_var[3]}`

  data.push({
    "category": req.body.post_genre,
    "title": req.body.post_title,
    "content": req.body.post_content,
    "date_posted": date
  }
  )

  data = JSON.stringify(data)

  // console.log(data)
  // console.log(typeof data)

  fs.writeFileSync(__dirname + "/public/db.json", data)

  let postsList = JSON.parse(fs.readFileSync(__dirname + "/public/db.json", { encoding: "utf-8" }))

  postsList.forEach(post => {
    app.get(`/post/${post.title.replace(/ /g, "-")}`, function(req, res) {
      res.render(__dirname + "/public/postview.ejs", { postData: JSON.stringify(post) })

    })

    console.log("/post/" + post.title.replace(/ /g, "-"))
  })


  res.redirect(302, "/")
})

app.get("/filter/:filter", function(req, res) {
  let category = req.params.filter || null
  let valids = ["food", "dance", "folklore", "language", "music", "festivals",
    "beliefs", "values", "traditions", "dressing"]
  if (category == null || !(valids.includes(category.toLowerCase()))) return

  let data
  (function() {
    data = fs.readFileSync(__dirname + "/public/db.json", { encoding: "utf-8" })

    // console.log(data)

  })()

  res.render(__dirname + "/public/home", { posts: data, filter: category })
})

app.use(express.static(__dirname + "/public/"))

app.get("/post/make-a-post", function(req, res) {
  res.redirect(308, "/make-a-post")
})
let postsList = JSON.parse(fs.readFileSync(__dirname + "/public/db.json", { encoding: "utf-8" }))

  postsList.forEach(post => {
    app.get(`/post/${post.title.replace(/ /g, "-")}`, function(req, res) {
      res.render(__dirname + "/public/postview.ejs", { postData: JSON.stringify(post) })

    })

    console.log("/post/" + post.title.replace(/ /g, "-"))
  })

app.listen(process.env.port)
console.log("Server Up")