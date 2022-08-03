const request = require("supertest");
const app = require("./server.js");

describe("Testing server.js", () => {
  test("It should successfully do a get request for /", () => {
    return request(app)
      .get("/")
      .then(response => {
        expect(response.statusCode).toBe(200);
        expect(response.text).toBe('Hello World!')
      });
  });
});