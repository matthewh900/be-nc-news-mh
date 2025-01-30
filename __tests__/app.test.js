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
    test("should respond with 400 error if asked to sort by a key that doesn't exist", () => {
      return request(app).get("/api/articles?sort_by=size&order=asc").expect(400).then((res) => {
        expect(res.body.msg).toBe("bad request")
      })
    })
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("should respond with status code 200 and an array of comments if there are any", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments.length).toBe(11);
        res.body.comments.forEach((comment) => {
          expect(comment.hasOwnProperty("comment_id")).toBe(true);
          expect(comment.hasOwnProperty("votes")).toBe(true);
          expect(comment.hasOwnProperty("created_at")).toBe(true);
          expect(comment.hasOwnProperty("author")).toBe(true);
          expect(comment.hasOwnProperty("body")).toBe(true);
          expect(comment.hasOwnProperty("article_id")).toBe(true);
        });
      });
  });
  test("should respond with 404 error if given article_id can't be found", () => {
    return request(app)
      .get("/api/articles/100/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article cannot be found");
      });
  });
  test("should respond with 400 error if article_id is not valid", () => {
    return request(app)
      .get("/api/articles/not-an-article/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("should insert new comment and respond with status code 201", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "butter_bridge", body: "some words" })
      .expect(201)
      .then((res) => {
        const comment = res.body.comment;
        expect(comment.author).toBe("butter_bridge");
        expect(comment.body).toBe("some words");
        expect(comment.article_id).toBe("1");
      });
  });
  test("should respond with a 400 error if missing keys", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "butter_bridge" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("should respond with a 400 error if keys are not the correct type", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ author: "butter_bridge", body: 57 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("should respond with 404 error if given article_id can't be found", () => {
    return request(app)
      .post("/api/articles/100/comments")
      .send({ author: "butter_bridge", body: "some words" })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article cannot be found");
      });
  });
  test("should respond with 400 error if article_id is not valid", () => {
    return request(app)
      .post("/api/articles/not-an-article/comments")
      .send({ author: "butter_bridge", body: "some words" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("should update a given articles votes property", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then((res) => {
        expect(res.body.article.votes).toBe(101);
      });
  });
  test("should respond with 400 error if value given is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "one" })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("should respond with 404 error if article_id can't be found", () => {
    return request(app)
      .patch("/api/articles/100")
      .send({ inc_votes: 1 })
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("article cannot be found");
      });
  });
  test("should respond with 400 error if article_id is not valid", () => {
    return request(app)
      .patch("/api/articles/not-an-article")
      .send({ inc_votes: 1 })
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("should delete comment and respond with status code 204 and no content", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("should respond with 404 error if comment_id can't be found", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("comment cannot be found");
      });
  });
  test("should respond with 400 error if comment_id is not valid", () => {
    return request(app)
      .delete("/api/comments/not-a-comment")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("GET /api/users", () => {
  test("should respond with status code 200 and an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        expect(res.body.user.length).toBe(4);
        res.body.user.forEach((user) => {
          expect(user.hasOwnProperty("username")).toBe(true);
          expect(user.hasOwnProperty("name")).toBe(true);
          expect(user.hasOwnProperty("avatar_url")).toBe(true);
        });
      });
  });
});
