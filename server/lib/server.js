"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _http = _interopRequireDefault(require("http"));

var _path = _interopRequireDefault(require("path"));

var _socket = _interopRequireDefault(require("socket.io"));

var _linkedList = require("./linkedList");

var _cors = _interopRequireDefault(require("cors"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();
app.use((0, _cors["default"])());
app.use(_express["default"]["static"]("data"));
app.use(_bodyParser["default"].json());
app.use(_bodyParser["default"].urlencoded({
  extended: true
}));

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server);

var platlistPath = _path["default"].join("data", "playlist.json");

var storeData = function storeData(data) {
  try {
    _fs["default"].writeFileSync(platlistPath, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

var loadData = function loadData() {
  try {
    return JSON.parse(_fs["default"].readFileSync(platlistPath, "utf8"));
  } catch (err) {
    console.error(err);
    return false;
  }
};

io.on("connection", function (socket) {
  console.log("New client connected");
  socket.on("disconnect", function () {
    console.log("Client disconnected");
  });
});
var playlist = loadData() || {};
var linkedList = (0, _linkedList.getLinkedList)(playlist);
app.patch("/playlist", function (req, res) {
  if (req.body.op === "add") {
    linkedList.addNode(req.query.videoId);
  } else if (req.body.op === "remove") {
    linkedList.removeNode(req.query.nodeId);
  }

  storeData(linkedList.getNodes());
  io.sockets.emit("dataChanged", {
    playlistNodes: linkedList.getNodes()
  });
  res.send({
    playlistNodes: linkedList.getNodes()
  });
});
app.get("/playlist", function (req, res) {
  res.send(playlist);
});
server.listen(8081, function () {
  var address = server.address();
  console.log("App listening on port: ", address.port);
});