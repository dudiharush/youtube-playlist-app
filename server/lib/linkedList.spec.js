"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _linkedList = require("./linkedList");

var _faker = _interopRequireDefault(require("faker"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe("linked list functions", () => {
  test.skip("it should init the list with a single node with status 'added'", () => {
    debugger;
    const node = createNode();
    const linkedList = (0, _linkedList.getLinkedList)({
      [node.id]: node
    });
    const nodes = linkedList.getNodes();
    expect(Object.values(nodes).length).toEqual(1);
    expect(nodes[node.id].status).toEqual("added");
    expect(nodes[node.id].videoId).toEqual(node.videoId);
  });
  test.skip("it should add a single node with the correct input, and status 'added'", () => {
    debugger;
    const linkedList = (0, _linkedList.getLinkedList)({});

    const videoId = _faker.default.random.uuid();

    const id = linkedList.addNode(videoId);
    const nodes = linkedList.getNodes();
    const nodeArr = Object.values(nodes);
    expect(nodeArr.length).toEqual(1);
    expect(nodeArr[0].status).toEqual("added");
    expect(nodes[id].nextNodeId).toEqual(videoId);
  });
  test("it should add two nodes, and the first one's nextId should be qual to the secod id", () => {
    const linkedList = (0, _linkedList.getLinkedList)({});

    const firstVideoId = _faker.default.random.uuid();

    const firstId = linkedList.addNode(firstVideoId);

    const secondVideoId = _faker.default.random.uuid();

    const secondId = linkedList.addNode(secondVideoId);
    const nodes = linkedList.getNodes();
    expect(nodes[firstId].nextNodeId).toEqual(secondId);
  });
  test.skip("it should set a node status to 'removed' by its id", () => {
    const node = createNode();
    const linkedList = (0, _linkedList.getLinkedList)({
      [node.id]: node
    });
    let nodes = linkedList.getNodes();
    expect(node.status).toEqual("added");
    const id = linkedList.removeNode(node.id);
    expect(node.status).toEqual("removed");
  });
});
describe("linked list head and tail ids are correct", () => {
  test("it should init headId with the first node's id and tailId to the last node's id", () => {
    const firstNode = createNode();
    const lastNode = createNode();
    firstNode.nextNodeId = lastNode.id;
    const nodeMap = {
      [firstNode.id]: firstNode,
      [lastNode.id]: lastNode
    };
    const linkedList = (0, _linkedList.getLinkedList)(nodeMap);
    const {
      getHeadId,
      getTailId
    } = linkedList;
    expect(getHeadId()).toEqual(firstNode.id);
    expect(getTailId()).toEqual(lastNode.id);
  });
});

function createNode() {
  const videoId = _faker.default.random.uuid();

  const nodeId = _faker.default.random.uuid();

  return {
    status: "added",
    id: nodeId,
    videoId
  };
}