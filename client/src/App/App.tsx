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
import { useEffectOnce } from "react-use";

import { LinkedListData } from "../../../shared/types";
import { getVideoIds } from "../utils";
import { VideoDataMap } from "../apiService/apiService";
const getVideoId = require("get-video-id");

const App: React.FC = () => {
  const [videos, setVideos] = React.useState<VideoDataMap>({});
  const [playlist, setPlaylist] = React.useState<LinkedListData>({
    nodes: {},
    headId: undefined
  });
  const [selectedNodeId, setSelectedNodeId] = React.useState();
  const [inputUrl, setInputUrl] = React.useState();

  useEffectOnce(() => {
    const updatePlaylist = async (playlist: LinkedListData) => {
      const playlistIds = getVideoIds(playlist);
      const videos = await apiService.getVideosDataByIds(playlistIds);

      setPlaylist(playlist);
      setVideos(videos);
      if (playlist.headId && selectedNodeId === undefined) {
        setSelectedNodeId(playlist.headId);
      }
    };

    const socket = openSocket("http://localhost:8081");
    socket.on("dataChanged", updatePlaylist);

    (async () => {
      const { videos, playlist } = await apiService.getPlaylistAndVideos();
      setVideos(videos);
      setPlaylist(playlist);
      if (playlist.headId) {
        setSelectedNodeId(playlist.headId);
      }
    })();
    return () => {
      socket.off("dataChanged", updatePlaylist);
    };
  });

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

  const onVideoEnd = async (videoId: string) => {
    await apiService.removeVideoId(videoId);
  };

  return (
    <>
      <AppContainerStyled>
        <AppContentContainerStyled>
          <SideBarContainerStyled>
            <SearchBar onAddClick={addVideo} onInputChange={setInputUrl} />
            <Playlist
              videos={videos}
              playlist={playlist}
              onVideoSelected={setSelectedNodeId}
            />
          </SideBarContainerStyled>
          <VideoPlayerContainerStyled>
            <VideoPlayer
              video={videos && videos[selectedNodeId]}
              onEnd={onVideoEnd}
            />
          </VideoPlayerContainerStyled>
        </AppContentContainerStyled>
      </AppContainerStyled>
    </>
  );
};

export default App;
