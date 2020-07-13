const express = require("express");

const server = express();
server.use(express.json());

server.get("/", (req, res) => {
    res.json({ api: "Node API Project 2" });
  });
module.exports = server