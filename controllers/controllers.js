const { selectTopics, selectArticlesById, selectArticles } = require("../models/models");

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
    selectArticles().then((article) => {
        res.status(200).send({article})
    })
}
