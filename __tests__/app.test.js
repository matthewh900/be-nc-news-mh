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
  test("should respond with status code 200 and array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((res) => {
        expect(res.body.topic.length).toBe(3);
        res.body.topic.forEach((topic) => {
          expect(topic.hasOwnProperty("description")).toBe(true);
          expect(topic.hasOwnProperty("slug")).toBe(true);
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("should respond with status code 200 and article with matching article_id property", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((res) => {
        expect(res.body.article.hasOwnProperty("author")).toBe(true);
        expect(res.body.article.hasOwnProperty("title")).toBe(true);
        expect(res.body.article.hasOwnProperty("article_id")).toBe(true);
        expect(res.body.article.hasOwnProperty("body")).toBe(true);
        expect(res.body.article.hasOwnProperty("topic")).toBe(true);
        expect(res.body.article.hasOwnProperty("created_at")).toBe(true);
        expect(res.body.article.hasOwnProperty("votes")).toBe(true);
        expect(res.body.article.hasOwnProperty("article_img_url")).toBe(true);
      });
  });
  test("should respond with 404 error if the article_id cannot be found", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article cannot be found");
      });
  });
  test("should respond with 400 error if the given article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not-an-article")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/articles", () => {
  test("should respond with status code 200 and an array of articles", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.article.length).toBe(13);
        res.body.article.forEach((article) => {
          expect(article.hasOwnProperty("author")).toBe(true);
          expect(article.hasOwnProperty("title")).toBe(true);
          expect(article.hasOwnProperty("article_id")).toBe(true);
          expect(article.hasOwnProperty("body")).toBe(true);
          expect(article.hasOwnProperty("topic")).toBe(true);
          expect(article.hasOwnProperty("created_at")).toBe(true);
          expect(article.hasOwnProperty("votes")).toBe(true);
          expect(article.hasOwnProperty("article_img_url")).toBe(true);
          expect(article.hasOwnProperty("comment_count")).toBe(true);
        });
      });
  });
  test("should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body.article).toBeSorted({
          key: "created_at",
          descending: true,
        });
      });
  });
  describe.only("queries", () => {
    test("should be sorted by date in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeSorted({
            key: "created_at",
            ascending: true,
          });
        });
    });
    test("should be sorted by votes in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeSorted({
            key: "votes",
            ascending: true,
          });
        });
    });
    test("should be sorted by votes in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=desc")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeSorted({
            key: "votes",
            descending: true,
          });
        });
    });
    // test("should be sorted by comment_count in ascending order", () => {
    //   return request(app)
    //     .get("/api/articles?sort_by=comment_count&order=asc")
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.body.article).toBeSorted({
    //         key: "comment_count",
    //         ascending: true,
    //       });
    //     });
    // });
    // test("should be sorted by comment_count in descending order", () => {
    //   return request(app)
    //     .get("/api/articles?sort_by=comment_count&order=desc")
    //     .expect(200)
    //     .then((res) => {
    //       expect(res.body.article).toBeSorted({
    //         key: "comment_count",
    //         descending: true,
    //       });
    //     });
    // });
    test("should be sorted by article_id in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=asc")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeSorted({
            key: "article_id",
            ascending: true,
          });
        });
    });
    test("should be sorted by article_id in descending order", () => {
      return request(app)
        .get("/api/articles?sort_by=article_id&order=desc")
        .expect(200)
        .then((res) => {
          expect(res.body.article).toBeSorted({
            key: "article_id",
            descending: true,
          });
        });
    });
  });
});
