const db = require("../db/connection");

exports.selectTopics = () => {
  return db.query("SELECT * FROM topics").then(({ rows }) => {
    return rows;
  });
};

exports.selectArticlesById = (article_id) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1;", [article_id])
    .then((res) => {
      if (res.rows.length === 0) {
        return Promise.reject({ status: 404, msg: "article cannot be found" });
      } else {
        return res.rows[0];
      }
    });
};

exports.selectArticles = () => {
  let sql =
    "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id";

  return db.query(`${sql} ORDER BY created_at DESC`).then(({ rows }) => {
    return rows;
  });
};

//   return db
//     .query(
//       "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id ORDER BY articles.created_at"
//     )
//     .then(({ rows }) => {
//       return rows;
//     });
