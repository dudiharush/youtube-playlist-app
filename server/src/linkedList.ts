import uuidv4 from "uuid/v4";
import { NodeMap, VideoNode } from "../../shared/types";

export const getLinkedList = (loadedNodeMap: NodeMap = {}) => {
  const nodeMap = loadedNodeMap;
  let headId: string | undefined;
  let tailId: string | undefined;
  let length: number;

  const nodesArr = Object.values(nodeMap);
  length = nodesArr.length;

  if (length == 1) {
    headId = tailId = nodesArr[0].id;
  } else if (length > 1) {
    const notHeadNodes = nodesArr.reduce(
      (acc: { [key: string]: string }, node: VideoNode) => {
        if (node.status === "added" && node.nextNodeId) {
          acc[node.nextNodeId] = "notHead";
        }
        return acc;
      },
      {}
    );

    const headNode = nodesArr.find(
      node => node.status === "added" && notHeadNodes[node.id] === undefined
    );
    if (!headNode) {
      throw new Error("could not find a head node");
    }
    headId = headNode.id;

    let curNodeId: string | undefined = headId;
    while (curNodeId && nodeMap[curNodeId].nextNodeId) {
      curNodeId = nodeMap[curNodeId].nextNodeId;
    }
    tailId = curNodeId;
  }

  function addNode(videoId: string): string {
    const nodeId = uuidv4();
    nodeMap[nodeId] = {
      id: nodeId,
      data: { videoId },
      updatedAt: new Date(),
      status: "added"
    };
    if (!headId) {
      headId = nodeId;
    } else if (tailId) {
      nodeMap[tailId].nextNodeId = nodeId;
    }
    tailId = nodeId;
    length++;
    return nodeId;
  }

  function removeNode(nodeId: string) {
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
    length--;
  }

  const getNodes = () => nodeMap;

  const getHeadId = () => headId;

  const getTailId = () => tailId;

  const getLength = () => length;

  return {
    addNode,
    removeNode,
    getNodes,
    getHeadId,
    getTailId,
    getLength
  };
};
