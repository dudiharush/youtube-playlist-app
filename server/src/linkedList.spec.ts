import { getLinkedList } from "./linkedList";
import faker from "faker";
import {
  VideoNodeData,
  VideoNode,
  VideoNodeMap
} from "../../shared/video-types";

describe("linked list functions", () => {
  test("it should not init the list", () => {
    const linkedList = getLinkedList<VideoNodeData>();
    const { getHeadId, getTailId, getLength } = linkedList;
    expect(getLength()).toEqual(0);
    expect(getHeadId()).toBeUndefined;
    expect(getTailId()).toBeUndefined;
  });

  test("it should init the list with a single node", () => {
    const node = createNode();
    const nodeMap: VideoNodeMap = {
      [node.id]: node
    };
    const linkedList = getLinkedList(nodeMap);
    const { getHeadId, getTailId, getNodes, getLength } = linkedList;
    expect(getLength()).toEqual(1);
    const nodes = getNodes();
    expect(nodes[node.id]).toEqual(node);
    expect(getHeadId()).toEqual(node.id);
    expect(getTailId()).toEqual(node.id);
  });

  test("it should init the list with a single node", () => {
    const node: VideoNode = createNode();
    const linkedList = getLinkedList({ [node.id]: node });
    const { getNodes, getTailId, getHeadId, getLength } = linkedList;
    expect(getLength()).toEqual(1);
    const nodes = getNodes();
    const {
      data: { videoId }
    } = nodes[node.id];
    expect(nodes[node.id]).toEqual(node);
    expect(videoId).toEqual(node.data.videoId);
    expect(getHeadId()).toEqual(node.id);
    expect(getTailId()).toEqual(node.id);
  });

  test("it should init the list with two nodes", () => {
    const firstNode: VideoNode = createNode();
    const lastNode: VideoNode = createNode();
    firstNode.nextNodeId = lastNode.id;
    const nodeMap: VideoNodeMap = {
      [firstNode.id]: firstNode,
      [lastNode.id]: lastNode
    };
    const linkedList = getLinkedList(nodeMap);
    const { getHeadId, getTailId, getNodes, getLength } = linkedList;
    expect(getLength()).toEqual(2);
    const nodes = getNodes();
    expect(nodes[firstNode.id]).toEqual(firstNode);
    expect(nodes[lastNode.id]).toEqual(lastNode);
    expect(getHeadId()).toEqual(firstNode.id);
    expect(getTailId()).toEqual(lastNode.id);
  });

  test("it should add a single node with the correct input", () => {
    const linkedList = getLinkedList({});
    const videoId = faker.random.uuid();
    const id = linkedList.addNode(videoId);
    const { getNodes, getHeadId, getTailId, getLength } = linkedList;
    const nodes = getNodes();
    const node = nodes[id];
    expect(getHeadId()).toEqual(node.id);
    expect(getTailId()).toEqual(node.id);
    expect(getLength()).toEqual(1);
    expect(nodes[id]).toBeUndefined;
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

  test("it should delete a node by its id", () => {
    const node: VideoNode = createNode();
    const linkedList = getLinkedList({ [node.id]: node });
    let { getLength, getTailId, getHeadId, getNodes } = linkedList;
    const nodes = getNodes();
    expect(nodes[node.id]).toEqual(node);
    linkedList.removeNode(node.id);
    expect(nodes[node.id]).toBeUndefined;
    expect(getHeadId()).toBeUndefined;
    expect(getTailId()).toBeUndefined;
    expect(getLength()).toBe(0);
  });

  test("it should move node1 after node3", () => {
    const node1: VideoNode = createNode();
    const node2: VideoNode = createNode();
    const node3: VideoNode = createNode();
    node1.nextNodeId = node2.id;
    node2.nextNodeId = node3.id;

    const linkedList = getLinkedList({
      [node1.id]: node1,
      [node2.id]: node2,
      [node3.id]: node3
    });
    let {
      getLength,
      getTailId,
      getHeadId,
      getNodes,
      moveNodeAfter
    } = linkedList;
    moveNodeAfter({ afterNodeId: node3.id, sourceNodeId: node1.id });
    const nodes = getNodes();
    expect(getLength()).toBe(3);
    expect(nodes[node2.id].nextNodeId).toEqual(node3.id);
    expect(nodes[node3.id].nextNodeId).toEqual(node1.id);
    expect(nodes[node1.id].nextNodeId).toBeUndefined;
    expect(getHeadId()).toEqual(node2.id);
    expect(getTailId()).toEqual(node1.id);
  });

  test("it should move node3 before node1", () => {
    const node1: VideoNode = createNode();
    const node2: VideoNode = createNode();
    const node3: VideoNode = createNode();
    node1.nextNodeId = node2.id;
    node2.nextNodeId = node3.id;

    const linkedList = getLinkedList({
      [node1.id]: node1,
      [node2.id]: node2,
      [node3.id]: node3
    });
    let {
      getLength,
      getTailId,
      getHeadId,
      getNodes,
      moveNodeBefore
    } = linkedList;
    moveNodeBefore({ beforeNodeId: node1.id, sourceNodeId: node3.id });
    const nodes = getNodes();
    expect(getLength()).toBe(3);
    expect(nodes[node3.id].nextNodeId).toEqual(node1.id);
    expect(nodes[node1.id].nextNodeId).toEqual(node2.id);
    expect(nodes[node3.id].nextNodeId).toBeUndefined;
    expect(getHeadId()).toEqual(node3.id);
    expect(getTailId()).toEqual(node2.id);
  });
});

test.only("it should move node3 before node2", () => {
  const node1: VideoNode = createNode();
  const node2: VideoNode = createNode();
  const node3: VideoNode = createNode();
  const node4: VideoNode = createNode();
  node1.nextNodeId = node2.id;
  node2.nextNodeId = node3.id;
  node3.nextNodeId = node4.id;

  const linkedList = getLinkedList({
    [node1.id]: node1,
    [node2.id]: node2,
    [node3.id]: node3,
    [node4.id]: node4
  });

  let {
    getLength,
    getTailId,
    getHeadId,
    getNodes,
    moveNodeBefore
  } = linkedList;
  moveNodeBefore({ beforeNodeId: node2.id, sourceNodeId: node3.id });
  const nodes = getNodes();
  expect(getLength()).toBe(4);
  expect(nodes[node1.id].nextNodeId).toEqual(node3.id);
  expect(nodes[node3.id].nextNodeId).toEqual(node2.id);
  expect(nodes[node2.id].nextNodeId).toEqual(node4.id);
  expect(nodes[node4.id].nextNodeId).toBeUndefined;
  expect(getHeadId()).toEqual(node1.id);
  expect(getTailId()).toEqual(node4.id);
});

function createNode(): VideoNode {
  const videoId = faker.random.uuid();
  const nodeId = faker.random.uuid();
  return {
    updatedAt: new Date(),
    id: nodeId,
    data: { videoId }
  };
}

export {};
