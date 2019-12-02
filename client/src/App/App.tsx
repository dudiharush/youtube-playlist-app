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

import { getVideoIds } from "../utils";
import { VideoDataMap } from "../apiService/apiService";
import { PlaylistData } from "../../../shared/video-types";
const getVideoId = require("get-video-id");

const App: React.FC = () => {
  const [appState, setAppState] = React.useState<{
    videos: VideoDataMap;
    playlist: PlaylistData;
    selectedNodeId?: string;
  }>({ videos: {}, playlist: { nodes: {} } });
  const [inputUrl, setInputUrl] = React.useState();

  useEffectOnce(() => {
    const updatePlaylist = async (playlist: PlaylistData) => {
      const playlistIds = getVideoIds(playlist);
      const videos = await apiService.getVideosDataByIds(playlistIds);

      setAppState(state => ({ ...state, playlist, videos }));
      if (playlist.headId && appState.selectedNodeId === undefined) {
        setAppState(state => ({ ...state, selectedNodeId: playlist.headId }));
      }
    };

    const socket = openSocket("http://localhost:8081");
    socket.on("dataChanged", updatePlaylist);

    (async () => {
      const { videos, playlist } = await apiService.getPlaylistAndVideos();
      debugger;
      setAppState(state => ({ ...state, videos, playlist }));
      if (playlist.headId) {
        setSelectedNodeId(playlist.headId);
      }
    })();
    return () => {
      socket.off("dataChanged", updatePlaylist);
    };
  });

  const setSelectedNodeId = (selectedNodeId?: string) => {
    setAppState(state => ({ ...state, selectedNodeId }));
  };

  const getSelectedVideo = () => {
    const { videos } = appState;
    const selectedNode = getSelectedNode();
    return selectedNode && videos[selectedNode.data.videoId];
  };

  const getSelectedNode = () => {
    const {
      selectedNodeId,
      playlist: { nodes }
    } = appState;
    return selectedNodeId && nodes[selectedNodeId];
  };

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

  const onVideoEnd = async () => {
    const selectedNode = getSelectedNode();
    const nextNodeId = selectedNode && selectedNode.nextNodeId;
    await apiService.removeVideoId(appState.selectedNodeId!);
    setSelectedNodeId(nextNodeId!);
  };

  const removeVideo = async (nodeId: string) => {
    const selectedNode = getSelectedNode();
    if (selectedNode && selectedNode.id === nodeId) {
      setSelectedNodeId(undefined);
    }
    await apiService.removeVideoId(nodeId);
  };

  return (
    <>
      <AppContainerStyled>
        <AppContentContainerStyled>
          <SideBarContainerStyled>
            <SearchBar onAddClick={addVideo} onInputChange={setInputUrl} />
            <Playlist
              videos={appState.videos}
              playlist={appState.playlist}
              onVideoSelected={setSelectedNodeId}
              removeVideo={removeVideo}
            />
          </SideBarContainerStyled>
          <VideoPlayerContainerStyled>
            <VideoPlayer video={getSelectedVideo()} onEnd={onVideoEnd} />
          </VideoPlayerContainerStyled>
        </AppContentContainerStyled>
      </AppContainerStyled>
    </>
  );
};

export default App;
