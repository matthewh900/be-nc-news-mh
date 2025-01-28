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
// SELECT animals.*, COUNT(northcoder_id) AS number_of_fans
// FROM animals
// LEFT JOIN northcoders ON northcoders.favourite_animal_id = animals.animal_id
// GROUP BY animal_id
exports.selectArticles = () => {
  return db
    .query(
      "SELECT articles.*, COUNT(comment_id) AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id GROUP BY articles.article_id"
    )
    .then(({ rows }) => {
      return rows;
    });
};
