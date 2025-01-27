const endpointsJson = require("../endpoints.json");
const app = require("../app");
const request = require("supertest");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => seed(data));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("should return with status code 200 and array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        console.log(res.body.topic.length);
        expect(res.body.topic.length).toBe(3);
        res.body.topic.forEach((topic) => {
          expect(topic.hasOwnProperty("description")).toBe(true);
          expect(topic.hasOwnProperty("slug")).toBe(true);
        });
      });
  });
});
