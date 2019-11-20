import React from "react";
import { Video } from "../Video/Video";
import { PlaylistContainerStyled } from "./Playlist.styled";

interface PlayListProps {
  videos: Array<any>;
  onVideoSelected: (videoId: string) => void;
}

export const Playlist = ({ videos, onVideoSelected }: PlayListProps) => {
  return (
    <PlaylistContainerStyled>
      {videos &&
        videos.map((v: any) => (
          <Video
            key={v.id.videoId}
            video={v}
            handleVideoSelect={onVideoSelected}
          />
        ))}
    </PlaylistContainerStyled>
  );
};
