const comments = require("../db/data/test-data/comments");
const {
  selectTopics,
  selectArticlesById,
  selectArticles,
  selectCommentsByArticleId,
  insertComment,
  updateVotes,
  removeComment,
  selectUsers,
} = require("../models/models");

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
    res.status(200).send({ article });
  }).catch((err) => {
    console.log(err)
    next(err)
  });
};

exports.getCommentsByArticleId = (req, res, next) => {
  const { article_id } = req.params;
  selectCommentsByArticleId(article_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const newComment = req.body;
  if (
    newComment.author === undefined ||
    newComment.body === undefined ||
    typeof newComment.author !== "string" ||
    typeof newComment.body !== "string"
  ) {
    res.status(400).send({ msg: "bad request" });
  } else {
    newComment.article_id = req.params.article_id;
    insertComment(newComment)
      .then(() => {
        res.status(201).send({ comment: newComment });
      })
      .catch((err) => {
        next(err);
      });
  }
};

exports.patchVotes = (req, res, next) => {
  const article_id = req.params.article_id;
  const votesToAdd = req.body.inc_votes;
  updateVotes(votesToAdd, article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.deleteComment = (req, res, next) => {
  const { comment_id } = req.params;
  removeComment(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};

exports.getUsers = (req, res) => {
  selectUsers().then((user) => {
    res.status(200).send({ user });
  });
};
