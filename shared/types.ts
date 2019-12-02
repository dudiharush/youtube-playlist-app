interface NodeMetadata {
  updatedAt: Date;
}

export type Node<T> = NodeMetadata & {
  id: string;
  data: T;
  nextNodeId?: string;
};

export type NodeMap<T> = { [nodeId: string]: Node<T> };

export interface LinkedListData<T> {
  nodes: NodeMap<T>;
  headId?: string;
}
