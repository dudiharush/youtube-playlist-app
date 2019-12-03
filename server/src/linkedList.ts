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

  function moveNodeAfter({
    sourceNodeId,
    afterNodeId
  }: {
    sourceNodeId: string;
    afterNodeId: string;
  }): void {
    const afterNode = nodeMap[afterNodeId];
    const sourceNode = nodeMap[sourceNodeId];
    removeNode(sourceNodeId, false);
    sourceNode.nextNodeId = afterNode.nextNodeId;
    afterNode.nextNodeId = sourceNode.id;
    if (afterNode.id === tailId) {
      tailId = sourceNode.id;
    }
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

  function moveNodeBefore({
    sourceNodeId,
    beforeNodeId
  }: {
    sourceNodeId: string;
    beforeNodeId: string;
  }): void {
    if (!headId) return;
    const sourceNode = nodeMap[sourceNodeId];
    if (beforeNodeId === headId) {
      removeNode(sourceNode.id, false);
      sourceNode.nextNodeId = headId;
      headId = sourceNode.id;
    } else {
      let afterNode = nodeMap[headId];
      while (
        afterNode &&
        afterNode.nextNodeId &&
        beforeNodeId !== afterNode.nextNodeId
      ) {
        afterNode = nodeMap[afterNode.nextNodeId];
      }
      if (afterNode) {
        moveNodeAfter({
          sourceNodeId,
          afterNodeId: afterNode.id
        });
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

  function removeNode(nodeId: string, hardRemove = true) {
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

    if (hardRemove) {
      removeFromNodeMap(nodeId);
    }
  }

  const getNodes = () => nodeMap;

  const getHeadId = () => headId;

  const getTailId = () => tailId;

  const getLength = () => length;

  return {
    addNode,
    moveNodeAfter,
    moveNodeBefore,
    removeNode,
    getNodes,
    getHeadId,
    getTailId,
    getLength
  };
}
