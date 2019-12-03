import React from "react";
import {
  VideoContainerStyled,
  VideoDetailsContainerStyled,
  VideoTextStyled,
  VideoSeparatorStyled
} from "./VideoItem.styled";
const ytDurationFormat = require("youtube-duration-format");

interface VideoItemProps {
  video: any;
  handleVideoSelect(): void;
}

export const VideoItem = ({ video, handleVideoSelect }: VideoItemProps) => {
  return (
    <VideoContainerStyled onClick={() => handleVideoSelect()}>
      <img
        height="70px"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.description}
      />
      <div>
        <VideoDetailsContainerStyled>
          <div>{ytDurationFormat(video.contentDetails.duration)}</div>
          <VideoSeparatorStyled>{"-"}</VideoSeparatorStyled>
          <VideoTextStyled>{video.snippet.title}</VideoTextStyled>
        </VideoDetailsContainerStyled>
      </div>
    </VideoContainerStyled>
  );
};
