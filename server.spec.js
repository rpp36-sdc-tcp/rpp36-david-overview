const request = require("supertest");
const app = require("./server.js");
const psql = require('./postgres.js');

describe("Testing GET request to /", () => {
  it("It should successfully do a GET request for /", async () => {
    var response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});

describe("Testing GET request to /reviews", () => {
  it("It should successfully do a GET request for /reviews", async () => {
    var response = await request(app)
      .get("/reviews")
      .query({product_id: 1, page: 0, count:5, sort: 'helpful'})
      .expect("Content-Type", /json/)
      .expect(200);
  });

  it("It should find 2 reviews for product_id = 1", async () => {
    var response = await request(app)
      .get("/reviews")
      .query({product_id: 1});
    expect(response.body.results.length).toBe(2);
  });

  it("It should get reviews on the 2nd page", async () => {
    var response = await request(app)
      .get("/reviews")
      .query({product_id: 71699, page: 1, count:5, sort: 'helpful'});
      expect(response.body.results.length).toBe(4);
  });

  it("It should attempt to get reviews on the 3nd page when there are not enough reviews", async () => {
    var response = await request(app)
      .get("/reviews")
      .query({product_id: 71699, page: 2, count:5, sort: 'helpful'});
      expect(response.body.results.length).toBe(0);
  });

  it("It should only get the 2nd page of 3 reviews", async () => {
    expected = {
      "count": 3,
      "page": 3,
      "product": 413981,
      "results": [
        {"body": "Rem magni omnis nisi id dolor sint et et a. Eligendi qui et tenetur iste. Eveniet qui illum sunt aut beatae debitis facilis. Blanditiis exercitationem illum illum blanditiis aut enim rerum veritatis.", "date": "1970-01-02T20:53:48.444Z", "helpfulness": 12, "photos": [], "rating": 3, "recommend": true, "response": null, "review_id": 413979, "reviewer_name": "Henderson_Krajcik", "summary": "Maxime vel perspiciatis officiis veritatis ut natus et facere nostrum."},
        {"body": "Consequatur esse fuga unde nihil. Tempore dolores ut expedita non error qui. Aliquam necessitatibus inventore alias corrupti velit in voluptas repellat eos. Et inventore rerum doloremque veritatis et omnis voluptas. Vero libero officiis.", "date": "1970-01-02T20:08:21.049Z", "helpfulness": 26, "photos": [{"id": 196195, "url": "https://images.unsplash.com/photo-1512023983263-7e94bf6b913e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80"}], "rating": 1, "recommend": false, "response": null, "review_id": 413980, "reviewer_name": "Prudence60", "summary": "Similique facilis nostrum ea."},
        {"body": "Dolore illum magnam. Rerum minima molestias qui molestias doloribus. Sed consectetur blanditiis sapiente eos qui. Expedita esse accusamus rerum animi iste rerum.", "date": "1970-01-02T20:28:13.629Z", "helpfulness": 17, "photos": [{"id": 196196, "url": "https://images.unsplash.com/photo-1487174244970-cd18784bb4a4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1652&q=80"}], "rating": 5, "recommend": true, "response": "Corrupti aperiam qui est distinctio quia et qui.", "review_id": 413981, "reviewer_name": "Miles_Price", "summary": "Cum minus sunt repellendus."}]}
    var response = await request(app)
      .get("/reviews")
      .query({product_id: 71699, page: 1, count:3, sort: 'helpful'});
      expect(response.body.results.length).toBe(3);
      expect(response.body).toStrictEqual(expected);
  });
});

describe("Testing GET request to /reviews/meta", () => {
  it("It should successfully do a GET request for /reviews/meta", async () => {
    var response = await request(app)
      .get("/reviews/meta")
      .query({product_id: 71699})
      .expect("Content-Type", /json/)
      .expect(200);
    expect(typeof response.text).toBe("string");
  });

  it("It should find metadata for product_id=1", async () => {
    var expected = "{\"product_id\":\"1\",\"ratings\":{\"4\":1,\"5\":1},\"recommended\":{\"true\":1,\"false\":1},\"characteristics\":{\"Fit\":{\"id\":1,\"value\":4},\"Comfort\":{\"id\":3,\"value\":5},\"Length\":{\"id\":2,\"value\":3.5},\"Quality\":{\"id\":4,\"value\":4}}}"
    var response = await request(app)
      .get("/reviews/meta")
      .query({product_id: 1})
    expect(response.text).toBe(expected);
  });
});

describe("Testing POST request to /reviews", () => {
  it("It should successfully do a POST request for /reviews", async () => {
    var response = await request(app)
      .post("/reviews")
      .send({
        product_id: 71697,
        rating: 4,
        summary: 'asdasdasdasdasd',
        body: 'asdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdaasdasdsdasd',
        recommend: true,
        name: 'asdasdasdasd',
        email: 'asdasasddasd@asd.com',
        photos: ['https://images.unsplash.com/photo-1512023983263-7e94bf6b913e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1650&q=80'],
        characteristics: { '239715': 4 }
      })
    expect(response.statusCode).toBe(201);
    expect(response.text).toBe("Created review");
  });
});

describe("Testing PUT request to /reviews/71697/helpful", () => {
  it("It should successfully do a PUT request for /reviews/71697/helpful", async () => {
    var response = await request(app).put("/reviews/71697/helpful");
    expect(response.statusCode).toBe(204);
  });
});

describe("Testing PUT request to /reviews/71697/report", () => {
  it("It should successfully do a PUT request for /reviews/71697/report", async () => {
    var response = await request(app).put("/reviews/71697/report");
    expect(response.statusCode).toBe(204);
  });
});