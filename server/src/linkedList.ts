import uuidv4 from "uuid/v4";
import { NodeMap, Node } from "../../shared/types";

export function getLinkedList<T>(loadedNodeMap: NodeMap<T> = {}) {
  const nodeMap: NodeMap<T> = loadedNodeMap;
  let headId: string | undefined;
  let tailId: string | undefined;
  let length: number;

  const nodesArr = Object.values(nodeMap);
  length = nodesArr.length;

  if (length == 1) {
    headId = tailId = nodesArr[0].id;
  } else if (length > 1) {
    const notHeadNodes = nodesArr.reduce(
      (acc: { [key: string]: string }, node) => {
        if (node.nextNodeId) {
          acc[node.nextNodeId] = "notHead";
        }
        return acc;
      },
      {}
    );

    const headNode = nodesArr.find(node => notHeadNodes[node.id] === undefined);
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

  function insertNodeAfter({
    node,
    afterNodeId
  }: {
    node: Node<T>;
    afterNodeId: string;
  }): void {
    const afterNode = nodeMap[afterNodeId];
    const nextNodeId = afterNode.nextNodeId;
    node.nextNodeId = nextNodeId;
    afterNode.nextNodeId = node.id;
    if (afterNode.id === tailId) {
      tailId = node.id;
    }
    addToNodeMap(node);
  }

  function addToNodeMap(node: Node<T>) {
    nodeMap[node.id] = node;
    length++;
  }

  function removeFromNodeMap(nodeId: string) {
    if (nodeMap[nodeId]) {
      delete nodeMap[nodeId];
      length--;
    }
  }

  function insertNodeBefore({
    node,
    beforeNodeId
  }: {
    node: Node<T>;
    beforeNodeId: string;
  }): void {
    if (!headId) return;
    if (beforeNodeId === headId) {
      node.nextNodeId = headId;
      headId = node.id;
      addToNodeMap(node);
    } else {
      let afterNode = nodeMap[headId];
      while (afterNode && beforeNodeId === afterNode.nextNodeId) {
        afterNode = nodeMap[afterNode.nextNodeId];
      }
      if (afterNode) {
        insertNodeAfter({ node, afterNodeId: afterNode.id });
      }
    }
  }

  function createNode<T>(data: T) {
    return {
      id: uuidv4(),
      data,
      updatedAt: new Date()
    };
  }

  function addNode(data: T): string {
    const node = createNode(data);
    const nodeId = node.id;
    if (!headId) {
      headId = nodeId;
    } else if (tailId) {
      nodeMap[tailId].nextNodeId = nodeId;
    }
    tailId = nodeId;
    addToNodeMap(node);
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
    removeFromNodeMap(nodeId);
  }

  const getNodes = () => nodeMap;

  const getHeadId = () => headId;

  const getTailId = () => tailId;

  const getLength = () => length;

  return {
    addNode,
    insertNodeAfter,
    insertNodeBefore,
    removeNode,
    getNodes,
    getHeadId,
    getTailId,
    getLength
  };
}
