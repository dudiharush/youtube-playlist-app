"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinkedList = void 0;

var getLinkedList = function getLinkedList(loadedNodeMap) {
  var nodeMap = loadedNodeMap || {};
  var headId;
  var tailId;
  var nodesArr = Object.values(nodeMap);

  if (nodesArr.length > 0) {
    var notHeadNodes = nodesArr.reduce(function (acc, node) {
      if (node.status === "added" && node.nextNodeId) {
        acc[node.nextNodeId] = "notHead";
      }

      return acc;
    }, {});
    var headNode = nodesArr.find(function (node) {
      return notHeadNodes.status === "added" && notHeadNodes[node.id] === undefined;
    });

    if (!headNode) {
      console.log({
        nodesArr: nodesArr
      });
      throw new Error("could not find a head node");
    }

    headId = headNode.id;
    var curNodeId = headId;

    while (curNodeId && nodeMap[curNodeId].nextNodeId) {
      curNodeId = nodeMap[curNodeId].nextNodeId;
    }

    tailId = curNodeId;
  }

  function addNode(videoId) {
    var nodeId = uuidv4();
    nodeMap[nodeId] = {
      id: nodeId,
      videoId: videoId,
      status: "added"
    };

    if (!headId) {
      headId = nodeId;
    } else if (tailId) {
      nodeMap[tailId].nextNodeId = nodeId;
    }

    tailId = nodeId;
  }

  function removeNode(nodeId) {
    var prevNodeId;
    var curNodeId = headId;

    if (headId === tailId) {
      tailId = headId = undefined;
    } else if (nodeId === headId) {
      headId = nodeMap[headId].nextNodeId;
    } else {
      while (curNodeId && curNodeId !== nodeId) {
        prevNodeId = curNodeId;
        curNodeId = nodeMap[curNodeId].nextNodeId;
      }

      if (curNodeId && prevNodeId) {
        if (nodeId === tailId) {
          tailId = nodeMap[prevNodeId].id;
        }

        nodeMap[prevNodeId].nextNodeId = nodeMap[curNodeId].nextNodeId;
      }
    }

    if (nodeMap[nodeId]) nodeMap[nodeId].status = "removed";
  }

  var getNodes = function getNodes() {
    return nodeMap;
  };

  return {
    addNode: addNode,
    removeNode: removeNode,
    getNodes: getNodes
  };
};

exports.getLinkedList = getLinkedList;