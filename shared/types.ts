export type EntityStatus = "added" | "removed";

interface NodeMetadata {
  updatedAt: Date;
  status: EntityStatus;
}

export interface Node<T> extends NodeMetadata {
  id: string;
  data: T;
  nextNodeId?: string;
}

type VideoNodeData = { videoId: string };

export type VideoNode = Node<VideoNodeData>;

export type NodeMap = { [nodeId: string]: VideoNode };

export interface LinkedListData {
  nodes: NodeMap;
  headId?: string;
}
