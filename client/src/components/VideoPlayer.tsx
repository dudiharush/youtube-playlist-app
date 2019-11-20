import React from "react";
import YouTube, { Options } from "react-youtube";

interface VideoPlayerProps {
  video: any;
  onEnd?: (videoId: string) => void;
}

const opts: Options = {
  height: "390",
  width: "640",
  playerVars: {
    autoplay: 1
  }
};

export const VideoPlayer = ({ video, onEnd }: VideoPlayerProps) => {
  if (!video) {
    return <div>No video selected</div>;
  }

  const getVideoId = (event: any) => event.target.getVideoData()["video_id"];
  console.log("video", video);
  return (
    <div>
      <div>
        <YouTube
          videoId={video.id}
          opts={opts}
          onEnd={event => {
            onEnd && onEnd(getVideoId(event));
          }}
        />
      </div>
      <div>
        <h4>{video.snippet.title}</h4>
      </div>
    </div>
  );
};
