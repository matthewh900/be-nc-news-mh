const express = require("express");
const app = express();
const endpoints = require("./endpoints.json");
const { getTopics, getArticlesById } = require("./controllers/controllers");

app.use(express.json());

app.get("/api", (req, res) => {
  res.status(200).send({ endpoints });
});

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticlesById)

app.use((err, req, res, next) => {
  if (err.status) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
});

app.use((err, req, res, next) => {
    if(err.code === "22P02"){
        res.status(400).send({msg: "bad request"})
    } else {
        next(err)
    }
})

module.exports = app;
