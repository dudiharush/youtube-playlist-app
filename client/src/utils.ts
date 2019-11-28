import { LinkedListData } from "../../shared/types";

export const getVideoIds = ({ headId, nodes }: LinkedListData): string[] => {
  const videoIds = [];
  if (!headId) return [];
  let currNode = nodes[headId];
  while (currNode) {
    videoIds.push(currNode.data.videoId);
    currNode = nodes[currNode.nextNodeId!];
  }
  return videoIds;
};
