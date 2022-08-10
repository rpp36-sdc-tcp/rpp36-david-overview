const express = require("express")
const app = express();
const port = 3000;
const psql = require('./postgres.js')

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/datadump", (req, res) => {
  psql.query('test', 'test', (err, data) => {
    console.log('err', err);
    console.log('data', data)
  })
})

app.listen(port, () => {
  console.log("Example app listening on port ${port}")
})

module.exports = app;