"use strict";

var _express = _interopRequireDefault(require("express"));

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _http = _interopRequireDefault(require("http"));

var _path = _interopRequireDefault(require("path"));

var _socket = _interopRequireDefault(require("socket.io"));

var _linkedList = require("./linkedList");

var _cors = _interopRequireDefault(require("cors"));

var _fs = _interopRequireDefault(require("fs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.static("data"));
app.use(_bodyParser.default.json());
app.use(_bodyParser.default.urlencoded({
  extended: true
}));

const server = _http.default.createServer(app);

const io = (0, _socket.default)(server);

const platlistPath = _path.default.join("data", "playlist.json");

const storeData = data => {
  try {
    _fs.default.writeFileSync(platlistPath, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const loadData = () => {
  let data = {};

  try {
    if (_fs.default.existsSync(platlistPath)) {
      data = JSON.parse(_fs.default.readFileSync(platlistPath, "utf8"));
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  return data;
};

io.on("connection", socket => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});
let playlist = loadData() || {};
let linkedList = (0, _linkedList.getLinkedList)(playlist);
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
  const address = server.address();
  console.log("App listening on port: ", address.port);
});