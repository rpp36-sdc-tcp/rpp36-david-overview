const express = require("express")
const app = express();
const port = 3001;
const psql = require('./postgres.js');
const data = require('./exampledata.js');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!")
})

app.get("/reviews", async (req, res) => {
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
    page = Number(page);
  } else {
    page = 0;
  }
  if (req.query.count) {
    count = req.query.count;
    count = Number(count);
  } else {
    count = 5;
  }
  if (req.query.sort) {
    sort = req.query.sort;
  } else {
    sort = 'helpful';
  }
  var query = 'SELECT id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews.reviews WHERE product_id=$1';
  var reviews = await psql.query(query, [id]);
  reviews = reviews.rows;
  var index = page * count;
  if (reviews.length < index) {
    reviews = [];
  } else {
    var end = index + count;
    if (reviews.length > end) {
      reviews = reviews.slice(index, (index + count));
    } else {
      reviews = reviews.slice(index, reviews.length);
    }
  }
  for (var i = 0; i < reviews.length; i++) {
    var id = reviews[i].id;
    delete reviews[i].id;
    reviews[i]['review_id'] = id;
    var date = new Date(reviews[i].date/1e4)
    reviews[i].date = date;
    if (reviews[i].response === 'null') {
      reviews[i].response = null;
    }
    var photoQuery = 'SELECT id, URL FROM reviews.photos WHERE review_id=$1';
    var photos = await psql.query(photoQuery, [id]);
    reviews[i].photos = photos.rows;
  }
  var test = {
    product: id,
    page: index,
    count: count,
    results: reviews
  }
  res.status(200).send(test)
})


app.get("/reviews/meta", async (req, res) => {
  //product_id
  //status 200 OK
  //req.query { product_id: '71697' }
  var id = req.query.product_id;
  var test = {product_id: id}
  var query = 'SELECT id, rating, summary, recommend, response, body, date, reviewer_name, helpfulness FROM reviews.reviews WHERE product_id=$1';
  var reviews = await psql.query(query, [id]);
  reviews = reviews.rows;
  var ratings = {};
  var recommended = {};
  for (var i = 0; i < reviews.length; i++) {
    if (ratings[reviews[i].rating]) {
      ratings[reviews[i].rating]++;
    } else {
      ratings[reviews[i].rating] = 1;
    }
    if (recommended[reviews[i].recommend]) {
      recommended[reviews[i].recommend]++;
    } else {
      recommended[reviews[i].recommend] = 1;
    }
  }
  var characteristics = {};
  var charQuery = 'SELECT value, name, characteristic_id FROM reviews.characteristics WHERE product_id=$1';
  var char = await psql.query(charQuery, [id]);
  char = char.rows;
  for (var j = 0; j < char.length; j++) {
    if (characteristics[char[j].name]) {
      characteristics[char[j].name].value.push(char[j].value)
    } else {
      characteristics[char[j].name] = {
        id: char[j]['characteristic_id'],
        value: [char[j].value]
      }
    }
  }
  var average = (array) => array.reduce((a, b) => a + b) / array.length;
  for (key in characteristics) {
    var arr = characteristics[key].value;
    characteristics[key].value = average(arr);
  }
  test.ratings = ratings;
  test.recommended = recommended;
  test.characteristics = characteristics;
  res.status(200).send(test);
})


app.post("/reviews", async (req, res) => {
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
  var id = req.body['product_id'];
  var rating = req.body.rating;
  var summary = req.body.summary;
  var body = req.body.body;
  var recommend = req.body.recommend;
  var name = req.body.name;
  var email = req.body.email;
  var photos = req.body.photos;
  var characteristics = req.body.characteristics
  var date = Date.now();

  var countQuery = 'SELECT count(*) FROM reviews.reviews';
  var countReview = await psql.query(countQuery);
  countReview = countReview.rows[0].count;
  countReview++;
  var query = 'INSERT INTO reviews.reviews VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)';
  var values = [countReview, id, rating, date, summary, body, recommend, false, name, email, 'null', 0]
  await psql.query(query, values);

  var photoCountQuery = 'SELECT count(*) FROM reviews.photos';
  var countPhoto = await psql.query(photoCountQuery);
  countPhoto = countPhoto.rows[0].count;
  countPhoto++;
  if (photos) {
    for (var i = 0; i < photos.length; i++) {
      var photoQuery = 'INSERT INTO reviews.photos VALUES ($1, $2, $3)';
      var values = [countPhoto, countReview, photos[i]];
      await psql.query(photoQuery, values);
      countPhoto++;
    }
  }

  var characteristicsCountQuery = 'SELECT count(*) from reviews.characteristics';
  var countChar = await psql.query(characteristicsCountQuery);
  countChar = countChar.rows[0].count;
  countChar++;
  charQuery = 'INSERT INTO reviews.characteristics VALUES ($1, $2, $3, $4, $5, $6)';
  for (key in characteristics) {
    charTableQuery = 'SELECT * FROM reviews.char WHERE id=$1';
    var ref = await psql.query(charTableQuery, [key]);
    ref = ref.rows[0];
    var values = [countChar, key, countReview, characteristics[key], ref['product_id'], ref.name];
    await psql.query(charQuery, values);
    countChar++
  }

  res.status(201).send('Created review');
})

app.put("/reviews/:review_id/helpful", async (req, res) => {
  //review_id params: { review_id: '413958' },
  //status 204 NO CONTENT
  var id = req.params['review_id'];
  var query = 'SELECT helpfulness FROM reviews.reviews WHERE id=$1';
  var help = await psql.query(query, [id]);
  help = help.rows[0].helpfulness;
  help++;
  var query = 'UPDATE reviews.reviews SET helpfulness =$1 WHERE id =$2';
  await psql.query(query, [help, id]);
  var test = 'SELECT helpfulness FROM reviews.reviews WHERE id=$1';
  var rest = await psql.query(test, [id]);
  rest = rest.rows[0].helpfulness;
  res.status(204).send('Updated helpful');
})

app.put("/reviews/:review_id/report", async (req, res) => {
  //review_id
  //status 204 NO CONTENT
  var id = req.params['review_id'];
  var query = 'UPDATE reviews.reviews SET reported =$1 WHERE id =$2';
  await psql.query(query, [true, id]);
  var test = 'SELECT * FROM reviews.reviews WHERE id=$1';
  var rest = await psql.query(test, [id]);
  rest = rest.rows;
  res.status(204).send('Updated report status');
})

// app.listen(port, () => {
//   console.log(`Listening on port ${port}`)
// })

module.exports = app;