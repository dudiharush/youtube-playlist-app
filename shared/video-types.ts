import { Node, NodeMap, LinkedListData } from "./types";

export type VideoNodeData = { videoId: string };
export type VideoNode = Node<VideoNodeData>;
export type VideoNodeMap = NodeMap<VideoNodeData>;
export type PlaylistData = LinkedListData<VideoNodeData>;
