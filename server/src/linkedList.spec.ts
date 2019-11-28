import { getLinkedList, NodeMap, Node, VideoNode } from "./linkedList";
import faker from "faker";

describe("linked list functions", () => {
  test("it should not init the list", () => {
    const linkedList = getLinkedList();
    const { getHeadId, getTailId, getLength } = linkedList;
    expect(getLength()).toEqual(0);
    expect(getHeadId()).toBeUndefined;
    expect(getTailId()).toBeUndefined;
  });

  test("it should init the list with a single node", () => {
    const node: VideoNode = createNode();
    const nodeMap: NodeMap = {
      [node.id]: node
    };
    const linkedList = getLinkedList(nodeMap);
    const { getHeadId, getTailId, getNodes, getLength } = linkedList;
    expect(getLength()).toEqual(1);
    const nodes = getNodes();
    expect(nodes[node.id].status).toEqual("added");
    expect(getHeadId()).toEqual(node.id);
    expect(getTailId()).toEqual(node.id);
  });

  test("it should init the list with a single node with status 'added'", () => {
    const node: VideoNode = createNode();
    const linkedList = getLinkedList({ [node.id]: node });
    const { getNodes, getTailId, getHeadId, getLength } = linkedList;
    expect(getLength()).toEqual(1);
    const nodes = getNodes();
    const {
      status,
      data: { videoId }
    } = nodes[node.id];
    expect(status).toEqual("added");
    expect(videoId).toEqual(node.data.videoId);
    expect(getHeadId()).toEqual(node.id);
    expect(getTailId()).toEqual(node.id);
  });

  test("it should init the list with two nodes", () => {
    const firstNode: VideoNode = createNode();
    const lastNode: VideoNode = createNode();
    firstNode.nextNodeId = lastNode.id;
    const nodeMap: NodeMap = {
      [firstNode.id]: firstNode,
      [lastNode.id]: lastNode
    };
    const linkedList = getLinkedList(nodeMap);
    const { getHeadId, getTailId, getNodes, getLength } = linkedList;
    expect(getLength()).toEqual(2);
    const nodes = getNodes();
    expect(nodes[firstNode.id].status).toEqual("added");
    expect(nodes[lastNode.id].status).toEqual("added");
    expect(getHeadId()).toEqual(firstNode.id);
    expect(getTailId()).toEqual(lastNode.id);
  });

  test("it should add a single node with the correct input, and status 'added'", () => {
    const linkedList = getLinkedList({});
    const videoId = faker.random.uuid();
    const id = linkedList.addNode(videoId);
    const { getNodes, getHeadId, getTailId, getLength } = linkedList;
    const nodes = getNodes();
    const node = nodes[id];
    expect(getHeadId()).toEqual(node.id);
    expect(getTailId()).toEqual(node.id);
    expect(getLength()).toEqual(1);
    expect(node.status).toEqual("added");
  });

  test("it should add two nodes, and the first one's nextId should be qual to the secod id", () => {
    const linkedList = getLinkedList({});
    const firstVideoId = faker.random.uuid();
    const firstId = linkedList.addNode(firstVideoId);
    const secondVideoId = faker.random.uuid();
    const secondId = linkedList.addNode(secondVideoId);
    const { getNodes, getHeadId, getTailId } = linkedList;
    const nodes = getNodes();
    expect(nodes[firstId].nextNodeId).toEqual(secondId);
    expect(getHeadId()).toEqual(firstId);
    expect(getTailId()).toEqual(secondId);
  });

  test("it should set a node status to 'removed' by its id", () => {
    const node: VideoNode = createNode();
    const linkedList = getLinkedList({ [node.id]: node });
    let { getLength, getTailId, getHeadId } = linkedList;
    expect(node.status).toEqual("added");
    linkedList.removeNode(node.id);
    expect(node.status).toEqual("removed");
    expect(getHeadId()).toBeUndefined;
    expect(getTailId()).toBeUndefined;
    expect(getLength()).toBe(0);
  });
});

function createNode(): VideoNode {
  const videoId = faker.random.uuid();
  const nodeId = faker.random.uuid();
  return {
    status: "added",
    id: nodeId,
    data: { videoId }
  };
}

export {};
