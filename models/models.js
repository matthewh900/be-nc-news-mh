const { patchVotes } = require("../controllers/controllers");
const db = require("../db/connection");
const format = require("pg-format");

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

function checkArticleExists(article_id) {
  const sql = format(
    "SELECT * FROM articles WHERE article_id = %L",
    article_id
  );
  return db.query(sql).then(({ rows }) => {
    if (rows.length === 0) {
      return false;
    } else {
      return true;
    }
  });
}

exports.selectCommentsByArticleId = (article_id) => {
  return checkArticleExists(article_id)
    .then((res) => {
      if (res === true) {
        return db.query(
          "SELECT * FROM comments WHERE comments.article_id = $1",
          [article_id]
        );
      } else {
        return Promise.reject({ status: 404, msg: "article cannot be found" });
      }
    })
    .then((res) => {
      return res.rows;
    });
};

exports.insertComment = (newComment) => {
    const author = newComment.author
    const body = newComment.body
    const article_id = newComment.article_id
    return checkArticleExists(article_id).then((res) => {
        if (res === true){
            const date = new Date()
            const votes = 0
            const values = [body, author, article_id, votes, date]
            const insertCommentSql = `INSERT INTO comments (body, author, article_id, votes, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *`
            return db.query(insertCommentSql, values).then(({rows}) => {
                return rows
            })
        } else {
            return Promise.reject({ status: 404, msg: "article cannot be found" });
        }
    })
}

exports.updateVotes = (votesToAdd, article_id) => {
    return checkArticleExists(article_id).then((res) => {
        if(res === true){
            const sqlValues = [votesToAdd, article_id]
            const sql = `UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`
            return db.query(sql, sqlValues).then(({rows}) => {
                return rows[0]
            })
        } else {
            return Promise.reject({ status: 404, msg: "article cannot be found" });
        }
    })
}

function checkCommentExists(comment_id) {
    const sql = format(
      "SELECT * FROM comments WHERE comment_id = %L",
      comment_id
    );
    return db.query(sql).then(({ rows }) => {
      if (rows.length === 0) {
        return false;
      } else {
        return true;
      }
    });
  }

exports.removeComment = (comment_id) => {
    return checkCommentExists(comment_id).then((res) => {
        if (res === true){
            return db.query("DELETE FROM comments WHERE comment_id = $1", [comment_id])
        } else {
            return Promise.reject({ status: 404, msg: "comment cannot be found" });
        }
    })
}

exports.selectUsers = () => {
    return db.query("SELECT * FROM users").then(({rows}) => {
        return rows
    })
}
