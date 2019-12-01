import React from "react";
import {
  VideoContainerStyled,
  VideoDetailsContainerStyled,
  VideoTextStyled,
  VideoSeparatorStyled
} from "./Video.styled";
const ytDurationFormat = require("youtube-duration-format");

interface VideoProps {
  video: any;
  handleVideoSelect(): void;
}

export const Video = ({ video, handleVideoSelect }: VideoProps) => {
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
