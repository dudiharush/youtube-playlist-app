import { Node, NodeMap, LinkedListData } from "linked-list-normalized";

export type VideoNodeData = { videoId: string };
export type VideoNode = Node<VideoNodeData>;
export type VideoNodeMap = NodeMap<VideoNodeData>;
export type PlaylistData = LinkedListData<VideoNodeData>;
export type PositionType = "before" | "after";
