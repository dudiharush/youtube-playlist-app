import express from "express";
import bodyParser from "body-parser";
import http from "http";
import path from "path";
import socketIo from "socket.io";
import { getLinkedList } from "./linkedList";
import cors from "cors";
import fs from "fs";
import { AddressInfo } from "net";
import { NodeMap, LinkedListData } from "../../shared/types";

var app = express();
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

const platlistPath = path.join("data", "playlist.json");

const storeData = (data: NodeMap) => {
  try {
    fs.writeFileSync(platlistPath, JSON.stringify(data));
  } catch (err) {
    console.error(err);
  }
};

const loadData = () => {
  let data = {};
  try {
    if (fs.existsSync(platlistPath)) {
      data = JSON.parse(fs.readFileSync(platlistPath, "utf8"));
    }
  } catch (err) {
    console.error(err);
    return false;
  }
  return data;
};

io.on("connection", (socket: any) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

let playlist: NodeMap = loadData() || {};

let linkedList = getLinkedList(playlist);

app.patch("/playlist", function(req, res) {
  if (req.body.op === "add") {
    linkedList.addNode(req.query.videoId);
  } else if (req.body.op === "remove") {
    console.log("remove nodeId", req.query.nodeId);
    linkedList.removeNode(req.query.nodeId);
  }

  storeData(linkedList.getNodes());
  io.sockets.emit("dataChanged", {
    nodes: linkedList.getNodes(),
    headId: linkedList.getHeadId()
  } as LinkedListData);
  res.send();
});

app.get("/playlist", function(req, res) {
  res.send({
    nodes: playlist,
    headId: linkedList.getHeadId()
  } as LinkedListData);
});

server.listen(8081, function() {
  const address = server.address() as AddressInfo;
  console.log("App listening on port: ", address.port);
});
