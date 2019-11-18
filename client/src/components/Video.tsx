import React from "react";
const ytDurationFormat = require("youtube-duration-format");

interface VideoProps {
  video: any;
  handleVideoSelect(videoId: string): void;
}

export const Video = ({ video, handleVideoSelect }: VideoProps) => {
  return (
    <div
      onClick={() => handleVideoSelect(video.id)}
      style={{ cursor: "pointer", marginBottom: "10px" }}
    >
      <img
        height="70px"
        src={video.snippet.thumbnails.medium.url}
        alt={video.snippet.description}
      />
      <div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center"
          }}
        >
          <div>{ytDurationFormat(video.contentDetails.duration)}</div>
          <div style={{ marginLeft: "4px", marginRight: "4px" }}>{"-"}</div>
          <div
            style={{
              textAlign: "right",
              direction: "rtl",
              width: "220px",
              textOverflow: "ellipsis",
              overflow: "hidden",
              whiteSpace: "nowrap"
            }}
          >
            {video.snippet.title}
          </div>
        </div>
      </div>
    </div>
  );
};
