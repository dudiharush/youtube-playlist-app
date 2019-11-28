"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLinkedList = void 0;

var _v = _interopRequireDefault(require("uuid/v4"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const getLinkedList = (loadedNodeMap = {}) => {
  const nodeMap = loadedNodeMap;
  let headId;
  let tailId;
  const nodesArr = Object.values(nodeMap);

  if (nodesArr.length == 1) {
    headId = tailId = nodesArr[0].id;
  } else if (nodesArr.length > 1) {
    const notHeadNodes = nodesArr.reduce((acc, node) => {
      if (node.status === "added" && node.nextNodeId) {
        acc[node.nextNodeId] = "notHead";
      }

      return acc;
    }, {});
    console.log({
      notHeadNodes
    });
    const headNode = nodesArr.find(node => notHeadNodes.status === "added" && notHeadNodes[node.id] === undefined);

    if (!headNode) {
      console.log({
        nodesArr
      });
      throw new Error("could not find a head node");
    }

    headId = headNode.id;
    let curNodeId = headId;

    while (curNodeId && nodeMap[curNodeId].nextNodeId) {
      curNodeId = nodeMap[curNodeId].nextNodeId;
    }

    tailId = curNodeId;
  }

  function addNode(videoId) {
    const nodeId = (0, _v.default)();
    nodeMap[nodeId] = {
      id: nodeId,
      videoId,
      status: "added"
    };

    if (!headId) {
      headId = nodeId;
    } else if (tailId) {
      nodeMap[tailId].nextNodeId = nodeId;
    }

    tailId = nodeId;
    return nodeId;
  }

  function removeNode(nodeId) {
    let prevNodeId;
    let curNodeId = headId;

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

  const getNodes = () => nodeMap;

  const getHeadId = () => headId;

  const getTailId = () => tailId;

  return {
    addNode,
    removeNode,
    getNodes,
    getHeadId,
    getTailId
  };
};

exports.getLinkedList = getLinkedList;