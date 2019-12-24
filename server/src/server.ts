import express from "express";
import bodyParser from "body-parser";
import http from "http";
import path from "path";
import socketIo from "socket.io";
import cors from "cors";
import fs from "fs";
import { AddressInfo } from "net";
import {
  VideoNodeMap,
  PlaylistData,
  PositionType
} from "../../shared/video-types";

import { fromNodes } from "linked-list-normalized";

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

const platlistPath = path.join(__dirname, "..", "data", "playlist.json");

const storeData = (videoMap: VideoNodeMap) => {
  try {
    fs.writeFileSync(platlistPath, JSON.stringify(videoMap));
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

let playlist: VideoNodeMap = loadData() || {};

let linkedList = fromNodes(playlist);

app.patch("/playlist", function(req, res) {
  if (req.body.op === "add") {
    linkedList.addNode({ videoId: req.query.videoId });
  } else if (req.body.op === "remove") {
    linkedList.removeNode(req.query.nodeId);
  } else if (req.body.op === "move") {
    const {
      sourceNodeId,
      targetNodeId,
      positionType
    }: {
      positionType: PositionType;
      sourceNodeId: string;
      targetNodeId: string;
    } = req.query;
    if (positionType === "before") {
      linkedList.moveNodeBefore({
        sourceNodeId,
        beforeNodeId: targetNodeId
      });
    } else {
      
      linkedList.moveNodeAfter({
        sourceNodeId,
        afterNodeId: targetNodeId
      });
    }
  }

  storeData(linkedList.getNodes());
  io.sockets.emit("dataChanged", {
    nodes: linkedList.getNodes(),
    headId: linkedList.getHeadId()
  } as PlaylistData);
  res.send();
});

app.get("/playlist", function(req, res) {
  res.send({
    nodes: playlist,
    headId: linkedList.getHeadId()
  } as PlaylistData);
});

server.listen(8081, function() {
  const address = server.address() as AddressInfo;
  console.log("App listening on port: ", address.port);
});
