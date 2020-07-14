const express = require("express");

const server = express();

const postRouter = require('./routers/postsRouters')

server.use(express.json());

server.use("/api/posts", postRouter)

server.get("/", (req, res) => {
    res.json({ api: "Node API Project 2" });
  });
module.exports = server