import React, { useCallback, useEffect, useState } from "react";
import { arrayMove } from "react-movable";
import openSocket from "socket.io-client";
import { LinkedListData } from "../../../shared/types";
import {
  PlaylistData,
  VideoNode,
  VideoNodeData
} from "../../../shared/video-types";
import * as apiService from "../apiService/apiService";
import { VideoDataMap } from "../apiService/apiService";
import { Playlist } from "../components/Playlist/PlayList";
import { SearchBar } from "../components/SearchBar/SearchBar";
import { VideoPlayer } from "../components/VideoPlayer";
import { getVideoIds } from "../utils";
import {
  AppContainerStyled,
  AppContentContainerStyled,
  SideBarContainerStyled,
  VideoPlayerContainerStyled
} from "./App.styled";

const getVideoId = require("get-video-id");

const App: React.FC = () => {
  const [appState, setAppState] = React.useState<{
    videos: VideoDataMap;
    playlist: PlaylistData;
    playlistArray: VideoNode[];
    selectedNodeId?: string;
  }>({ videos: {}, playlist: { nodes: {} }, playlistArray: [] });
  const [inputUrl, setInputUrl] = React.useState();

  const updatePlaylist = useCallback(
    async (playlist: PlaylistData) => {
      const playlistIds = getVideoIds(playlist);
      const videos = await apiService.getVideosDataByIds(playlistIds);
      debugger;
      if (playlist.headId && appState.selectedNodeId === undefined) {
        setAppState({
          selectedNodeId: playlist.headId,
          playlist,
          videos,
          playlistArray: getNodeArray(playlist)
        });
      } else {
        setAppState(state => ({
          ...state,
          playlist,
          videos,
          playlistArray: getNodeArray(playlist)
        }));
      }
    },
    [appState.selectedNodeId]
  );

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    const socket = openSocket("http://localhost:8081");
    socket.on("dataChanged", updatePlaylist);

    if (!isMounted) {
      (async () => {
        const { videos, playlist } = await apiService.getPlaylistAndVideos();
        debugger;
        setAppState({
          playlist,
          videos,
          playlistArray: getNodeArray(playlist),
          selectedNodeId: playlist.headId
        });
      })();
      setIsMounted(true);
    }

    return () => {
      socket.off("dataChanged", updatePlaylist);
    };
  }, [isMounted, updatePlaylist]);

  const setSelectedNodeId = (selectedNodeId?: string) => {
    debugger;
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
    debugger;
    return selectedNodeId && nodes[selectedNodeId];
  };

  const getNodeArray = ({
    nodes,
    headId
  }: LinkedListData<VideoNodeData>): VideoNode[] => {
    const nodeArray = [];
    if (headId) {
      let currNode = nodes[headId];
      while (currNode) {
        nodeArray.push(currNode);
        currNode = nodes[currNode.nextNodeId!];
      }
    }
    return nodeArray;
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

  const updatePlaylistArray = async ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number;
    newIndex: number;
  }) => {
    debugger;
    const { playlistArray } = appState;
    setAppState(state => ({
      ...state,
      playlistArray: arrayMove(state.playlistArray, oldIndex, newIndex)
    }));
    await apiService.moveVideo({
      sourceNodeId: playlistArray[oldIndex].id,
      targetNodeId: playlistArray[newIndex].id,
      positionType: oldIndex > newIndex ? "before" : "after"
    });
  };

  return (
    <>
      <AppContainerStyled>
        <AppContentContainerStyled>
          <SideBarContainerStyled>
            <SearchBar onAddClick={addVideo} onInputChange={setInputUrl} />
            <Playlist
              videos={appState.videos}
              playlistArray={appState.playlistArray}
              onVideoSelected={setSelectedNodeId}
              removeVideo={removeVideo}
              updatePlaylistArray={updatePlaylistArray}
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
