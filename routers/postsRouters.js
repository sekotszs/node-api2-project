const express = require("express");

const db = require("../data/db");

const router = express.Router();

router.post("/", (res, req) => {
  const post = req.body;
  if (!post.title || !post.contents) {
    res.status(400).json({ message: "Information is missing bruh" });
  } else {
    db.insert(post)
      .then((result) => {
        post.id = result.id;
        res.status(201).json(post);
      })
      .catch((error) => {
        res.status(500).json({ message: "There was an error" });
      });
  }
});

router.post("/:id/comments", (req, res) => {
  const comment = req.body;
  comment.post_id = Number(req.params.id);
  if (!comment.text) {
    res
      .status(400)
      .json({ errorMessage: "Please provide text for the comment." });
  } else {
    db.findById(Number(req.params.id))
      .then((result) => {
        if (result !== 0) {
          db.insertComment(comment)
            .then((commentResult) => {
              comment.id = commentResult.id;
              res.status(201).json(comment);
            })
            .catch((err) => {
              res
                .status(500)
                .json({
                  error:
                    "There was an error while saving the comment to the database",
                });
            });
        } else {
          res
            .status(404)
            .json({
              message: "The post with the specified ID does not exist.",
            });
        }
      })
  }
});

router.get("/", (req, res) => {
  db.find()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((error) => {
      res.status(500).json({ message: "There was an error" });
    });
});

router.get("/:id", (req, res) => {
  db.findById(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json(result);
      } else {
        res.status(404).json({ message: "Could not be found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "There was an error" });
    });
});

router.get("/:id/comments", (req, res) => {
  db.findById(Number(req.params.id)).then((result) => {
    if (result.length !== 0) {
      db.findPostComments(req.params.id)
        .then((commentResult) => {
          res.status(200).json(commentResult);
        })
        .catch((error) => {
          res.status(500).json({ message: "There was an error" });
        });
    } else {
      res.status(404).json({ message: "Not found" });
    }
  });
});

router.delete("/:id", (req, res) => {
  db.remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(2000).json({ message: "Deleted" });
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "There was an error" });
    });
});

router.put("/:id", (req, res) => {
  const changes = req.body;
  db.update(req.params.id, changes)
    .then((change) => {
      if (change) {
        res.status(200).json(change);
      } else {
        res.status(404).json({ message: "Not found" });
      }
    })
    .catch((error) => {
      res.status(500).json({ message: "There was an error" });
    });
});
module.exports = router;
