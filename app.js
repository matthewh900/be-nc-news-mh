const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics, getArticlesById, getArticles, getCommentsByArticleId, postComment, patchVotes, deleteComment, getUsers } = require("./controllers/controllers");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles)

app.get("/api/users", getUsers)

app.get("/api/articles/:article_id", getArticlesById)
app.patch("/api/articles/:article_id", patchVotes)

app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post("/api/articles/:article_id/comments", postComment)

app.delete("/api/comments/:comment_id", deleteComment)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    if(err.code === "22P02" || err.code === "42601"){
        res.status(400).send({msg: "bad request"})
    } else {
        next(err)
    }
})

module.exports = app;
