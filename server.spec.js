const request = require("supertest");
const app = require("./server.js");

describe("Testing server.js", () => {
  it("It should successfully do a get request for /", async () => {
    var response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe("Hello World!");
  });
});