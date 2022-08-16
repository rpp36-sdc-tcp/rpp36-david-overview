const express = require("express")
const app = express();
const port = 3001;
const psql = require('./postgres.js');
const data = require('./exampledata.js');

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/reviews", (req, res) => {
  //get all reviews
  //page default 1
  //count default 5
  //sort newest helpful relevant
  //product_id
  //status 200 OK
  //req.query { product_id: '71697' }
  var id = req.query.product_id;
  var page;
  var count;
  var sort;
  if (req.query.page) {
    page = req.query.page;
  } else {
    page = 1;
  }
  if (req.query.count) {
    count = req.query.count;
  } else {
    count = 5;
  }
  if (req.query.sort) {
    sort = req.query.sort;
  } else {
    sort = 'helpful';
  }
  res.status(200).send(data.reviews)
  //do query for all reviews from id/page/count/sort
})

app.get("/reviews/meta", (req, res) => {
  console.log(req);
  //product_id
  //status 200 OK
  //req.query { product_id: '71697' }
  var id = req.query.product_id;
  res.status(200).send(data.meta)
})

app.post("/reviews", (req, res) => {
  //product_id
  //rating 1-5 int
  //summary text
  //body text
  //recommend bool
  //name text
  //email text
  //photos array of text
  //characteristics obj keys and values { "14": 5, "15": 5 //...}
  //status 201 CREATED
})

app.put("/reviews/:review_id/helpful", (req, res) => {
  //review_id
  //status 204 NO CONTENT
})

app.put("/reviews/:review_id/report", (req, res) => {
  //review_id
  //status 204 NO CONTENT
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`)
})

module.exports = app;