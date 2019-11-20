var express = require("express");
var bodyParser = require("body-parser");
const http = require("http");
const path = require("path");
const socketIo = require("socket.io");
var app = express();
var cors = require("cors");
app.use(cors());
app.use(express.static("data"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
const server = http.createServer(app);
const io = socketIo(server);
const fs = require("fs");
const platlistPath = path.join("data", "playlist.json");

const storeData = data => {
  try {
    fs.writeFileSync(platlistPath, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const loadData = () => {
  try {
    return JSON.parse(fs.readFileSync(platlistPath, "utf8"));
  } catch (err) {
    console.error(err);
    return false;
  }
};

io.on("connection", socket => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

let playlistIds = loadData() || [];

app.patch("/playlist", function(req, res) {
  if (req.body.op === "add") {
    playlistIds.push(req.query.videoId);
  } else if (req.body.op === "remove") {
    playlistIds = playlistIds.filter(vId => vId !== req.query.videoId);
  }

  storeData(playlistIds);
  io.sockets.emit("dataChanged", { playlistIds });
  res.send({ playlistIds });
});

app.get("/playlist", function(req, res) {
  res.send(playlistIds);
});

server.listen(8081, function() {
  var port = server.address().port;
  console.log("App listening on port: ", port);
});
