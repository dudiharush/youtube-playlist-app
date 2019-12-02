import { PlaylistData } from "../../shared/video-types";

export const getVideoIds = ({ headId, nodes }: PlaylistData): string[] => {
  const videoIds = [];
  if (!headId) return [];
  let currNode = nodes[headId];
  while (currNode) {
    videoIds.push(currNode.data.videoId);
    currNode = nodes[currNode.nextNodeId!];
  }
  return videoIds;
};
