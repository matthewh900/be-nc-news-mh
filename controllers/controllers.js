const comments = require("../db/data/test-data/comments");
const { selectTopics, selectArticlesById, selectArticles, selectCommentsByArticleId } = require("../models/models");

exports.getTopics = (req, res) => {
  selectTopics().then((topic) => {
    res.status(200).send({ topic });
  });
};

exports.getArticlesById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticlesById(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
    selectArticles(req.query).then((article) => {
        res.status(200).send({article})
    })
}

exports.getCommentsByArticleId = (req, res, next) => {
    const {article_id} = req.params
    selectCommentsByArticleId(article_id).then((comments) => {
        res.status(200).send({comments})
    }).catch((err) => {
        next(err)
    })
}
