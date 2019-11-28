import React from "react";
import { Video } from "../Video/Video";
import { PlaylistContainerStyled } from "./Playlist.styled";
import { LinkedListData } from "../../../../shared/types";
import { VideoDataMap } from "../../apiService/apiService";

interface PlayListProps {
  videos: VideoDataMap;
  playlist: LinkedListData;
  onVideoSelected: (videoId: string) => void;
}

export const Playlist = ({
  playlist: { nodes, headId },
  videos,
  onVideoSelected
}: PlayListProps) => {
  const PlaylistItems = () => {
    const videoElements = [];
    if (headId) {
      let currNode = nodes[headId];
      while (currNode) {
        videoElements.push(
          <Video
            key={currNode.data.videoId}
            video={nodes[currNode.data.videoId]}
            handleVideoSelect={onVideoSelected}
          />
        );
        currNode = nodes[currNode.nextNodeId!];
      }
    }
    return <>{videoElements}</>;
  };

  return (
    <PlaylistContainerStyled>
      <PlaylistItems />
    </PlaylistContainerStyled>
  );
};
