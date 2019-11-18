import React from "react";
import { Video } from "./Video";

interface PlayListProps {
  videos: Array<any>;
  onVideoSelected: (videoId: string) => void;
}

export const PlayList = ({ videos, onVideoSelected }: PlayListProps) => {
  return (
    <div style={{ overflow: "scroll", height: "90vh" }}>
      {videos &&
        videos.map((v: any) => (
          <Video
            key={v.id.videoId}
            video={v}
            handleVideoSelect={onVideoSelected}
          />
        ))}
    </div>
  );
};
