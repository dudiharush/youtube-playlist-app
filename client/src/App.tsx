import React from "react";
import openSocket from "socket.io-client";
import * as apiService from "./apiService";
import "./App.css";
import { VideoPlayer } from "./VideoPlayer";
import { SearchBar } from "./SearchBar";
import { PlayList } from "./PlayList";
const getVideoId = require("get-video-id");

const App: React.FC = () => {
  const [videos, setVideos] = React.useState([]);
  const [selectedVideoIndex, setSelectedVideoIndex] = React.useState();
  const [inputUrl, setInputUrl] = React.useState();

  React.useEffect(() => {
    (async () => {
      const { items } = await apiService.getPlaylistVideosData();
      setVideos(items);
      if (items.length) {
        setSelectedVideoIndex(0);
      }
      const socket = openSocket("http://localhost:8081");
      socket.on("dataChanged", async ({ playlistIds }: { playlistIds: string[]}) => {
        const { items } = await apiService.getVideosDataByIds(playlistIds);
        setVideos(items);
      });
    })();
  }, [setSelectedVideoIndex]);

  const addVideo = async () => {
    let videoId;
    try {
      const { id } = getVideoId(inputUrl);
      videoId = id;
    }
    catch(e){
      alert('video Url format is incorrect! use this format: http://www.youtube.com/watch?v=someId')
    }
    
    await apiService.addVideoId(videoId);
  };

  const onVideoSelected = (videoId: string) => {
    const selectedVideoIndex = videos.findIndex(
      (video: any) => video.id === videoId
    );
    debugger;
    setSelectedVideoIndex(selectedVideoIndex);
  };

  const onVideoEnd = async (videoId: string) => {
    await apiService.removeVideoId(videoId);
  };

  return (
    <>
      <div className="App" style={{ display: "flex", height:'100vh', justifyContent:'center', alignItems:'center'}}>
        <div style={{ display: "flex", flexDirection: "row", height:'650px'}}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "500px",
              borderRight: "1px solid black",
              border:'1px solid black'
            }}
          >
            <SearchBar onAddClick={addVideo} onInputChange={setInputUrl} />
            <PlayList videos={videos} onVideoSelected={onVideoSelected} />
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              minWidth: '800px',
              justifyContent: "center",
              border:'1px solid black',
              width: "100%",
              marginInlineStart:'20px'
            }}
          >
            <VideoPlayer
              video={videos[selectedVideoIndex]}
              onEnd={onVideoEnd}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default App;
