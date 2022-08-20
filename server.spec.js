const request = require("supertest");
const app = require("./server.js");

describe("Testing GET request to /", () => {
  it("It should successfully do a GET request for /", async () => {
    var response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});

describe("Testing GET request to /reviews", () => {
  it("It should successfully do a GET request for /reviews", async () => {
    var response = await request(app).get("/reviews");
    expect(response.statusCode).toBe(200);
    expect(typeof response.text).toBe("string");
  });
});

describe("Testing GET request to /reviews/meta", () => {
  it("It should successfully do a GET request for /reviews/meta", async () => {
    var response = await request(app).get("/reviews/meta");
    expect(response.statusCode).toBe(200);
    expect(typeof response.text).toBe("string");
  });
});

describe("Testing POST request to /reviews", () => {
  it("It should successfully do a POST request for /reviews", async () => {
    var response = await request(app).post("/reviews");
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