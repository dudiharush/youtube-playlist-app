import React from "react";
import openSocket from "socket.io-client";
import * as apiService from "../apiService/apiService";
import { VideoPlayer } from "../components/VideoPlayer";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { Playlist } from "../components/Playlist/PlayList";
import {
  AppContainerStyled,
  AppContentContainerStyled,
  VideoPlayerContainerStyled,
  SideBarContainerStyled
} from "./App.styled";
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
      socket.on(
        "dataChanged",
        async ({ playlistIds }: { playlistIds: string[] }) => {
          const { items } = await apiService.getVideosDataByIds(playlistIds);
          setVideos(items);
          if (items.length && selectedVideoIndex === undefined) {
            setSelectedVideoIndex(0);
          }
        }
      );
    })();
  }, [setSelectedVideoIndex, selectedVideoIndex]);

  const addVideo = async () => {
    let videoId;
    try {
      const { id } = getVideoId(inputUrl);
      videoId = id;
    } catch (e) {
      alert(
        "video Url format is incorrect! use this format: http://www.youtube.com/watch?v=someId"
      );
    }
    if (videoId) {
      await apiService.addVideoId(videoId);
    }
  };

  const onVideoSelected = (videoId: string) => {
    const selectedVideoIndex = videos.findIndex(
      (video: any) => video.id === videoId
    );
    setSelectedVideoIndex(selectedVideoIndex);
  };

  const onVideoEnd = async (videoId: string) => {
    await apiService.removeVideoId(videoId);
  };

  return (
    <>
      <AppContainerStyled>
        <AppContentContainerStyled>
          <SideBarContainerStyled>
            <SearchBar onAddClick={addVideo} onInputChange={setInputUrl} />
            <Playlist videos={videos} onVideoSelected={onVideoSelected} />
          </SideBarContainerStyled>
          <VideoPlayerContainerStyled>
            <VideoPlayer
              video={videos[selectedVideoIndex]}
              onEnd={onVideoEnd}
            />
          </VideoPlayerContainerStyled>
        </AppContentContainerStyled>
      </AppContainerStyled>
    </>
  );
};

export default App;
