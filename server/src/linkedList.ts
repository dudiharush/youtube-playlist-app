export interface Node {
  status: "added" | "removed";
  id: string;
  videoId: string;
  nextNodeId?: string;
}

export interface NodeMap {
  [id: string]: Node;
}

export const getLinkedList = (loadedNodeMap: NodeMap) => {
  const nodeMap = loadedNodeMap || {};
  let headId: string | undefined;
  let tailId: string | undefined;

  const nodesArr = Object.values(nodeMap);
  if (nodesArr.length > 0) {
    const notHeadNodes = nodesArr.reduce(
      (acc: { [key: string]: string }, node: Node) => {
        if (node.status === "added" && node.nextNodeId) {
          acc[node.nextNodeId] = "notHead";
        }
        return acc;
      },
      {}
    );

    const headNode = nodesArr.find(
      node =>
        notHeadNodes.status === "added" && notHeadNodes[node.id] === undefined
    );
    if (!headNode) {
      console.log({ nodesArr });

      throw new Error("could not find a head node");
    }
    headId = headNode.id;

    let curNodeId: string | undefined = headId;
    while (curNodeId && nodeMap[curNodeId].nextNodeId) {
      curNodeId = nodeMap[curNodeId].nextNodeId;
    }
    tailId = curNodeId;
  }

  function addNode(videoId: string) {
    const nodeId = uuidv4();
    nodeMap[nodeId] = { id: nodeId, videoId, status: "added" };
    if (!headId) {
      headId = nodeId;
    } else if (tailId) {
      nodeMap[tailId].nextNodeId = nodeId;
    }
    tailId = nodeId;
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
  }

  const getNodes = () => nodeMap;

  return {
    addNode,
    removeNode,
    getNodes
  };
};
