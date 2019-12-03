import React, { useState } from "react";
import {
  VideoContainerStyled,
  VideoInfoContainerStyled,
  VideoTextStyled,
  VideoSeparatorStyled
} from "./VideoItem.styled";

const ytDurationFormat = require("youtube-duration-format");

interface VideoDetailsProps {
  video: any;
  handleVideoSelect(): void;
}

export const VideoDetails = ({
  video,
  handleVideoSelect
}: VideoDetailsProps) => {
  const [mouseMove, setMouseMove] = useState(false);
  return (
    <VideoContainerStyled
      onMouseMove={() => setMouseMove(true)}
      onMouseUp={() => {
        if (!mouseMove) {
          handleVideoSelect();
        }
        setMouseMove(false);
      }}
    >
      <img
        height="70px"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.description}
      />
      <div>
        <VideoInfoContainerStyled>
          <div>{ytDurationFormat(video.contentDetails.duration)}</div>
          <VideoSeparatorStyled>{"-"}</VideoSeparatorStyled>
          <VideoTextStyled>{video.snippet.title}</VideoTextStyled>
        </VideoInfoContainerStyled>
      </div>
    </VideoContainerStyled>
  );
};
