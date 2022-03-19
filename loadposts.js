const fs = require("fs")
const beautify = require("beautify")
exports.load = function(db) {
  db.set("hello", {
    "author": "Some author 1",
    "title": "Blog Post 1",
    "content": "First post content",
    "date_posted": "Dec 17, 2021"
  })

  let postsArray = {}

  db.list().then(keys => {
    a = 0
    keys.forEach(key => {
      a++
      db.get(key).then(value => {
        console.log(value)
        postsArray[a] = `<article class="media content-section">
      <div class="media-body">
        <div class="article-metadata">
          <a class="mr-2" href="/p">Anonymous</a>
          <small class="text-muted">${ value.date_posted }</small>
        </div>
      <h2><a class="article-title" href="#">${ value.title }</a></h2>
        <p class="article-content">${ value.content }</p>
      </div>
    </article>`
      })
    })
  })

  console.log(postsArray)

  // fs.writeFileSync("public/posts.ejs", posts)
}