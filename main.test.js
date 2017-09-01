// test/hello_test.js
const request = require("supertest");
const app = require("../app");

describe("GET /home", function () {
  test("should return successfully", function () {
    return request(app)
      .get("/home")
      .expect(200)
      // .expect("Content-Type", "application/json; charset=utf-8")
      // .expect(function (res) {
      //   expect(res.body['hello']).toBe("world");
      });
  })
})
