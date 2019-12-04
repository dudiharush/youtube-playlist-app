import axios from "axios";
import youtubeApi from "./youtubeApi";
import { getVideoIds } from "../utils";
import { PlaylistData, PositionType } from "../../../shared/video-types";
const instance = axios.create({
  baseURL: "http://www.localhost:8081"
});

export interface VideoDataMap {
  [videoId: string]: any;
}

export const addVideoId = (videoId: string) =>
  instance.patch(
    "/playlist",
    { op: "add" },
    {
      params: {
        videoId
      }
    }
  );

export const removeVideoId = (nodeId: string) =>
  instance.patch(
    "/playlist",
    { op: "remove" },
    {
      params: {
        nodeId
      }
    }
  );

export const moveVideo = ({
  sourceNodeId,
  targetNodeId,
  positionType
}: {
  sourceNodeId: string;
  targetNodeId: string;
  positionType: PositionType;
}) =>
  instance.patch(
    "/playlist",
    { op: "move" },
    {
      params: {
        sourceNodeId,
        targetNodeId,
        positionType
      }
    }
  );

export const getLinkedListData = () => instance.get<PlaylistData>("/playlist");

export const getVideosDataByIds = async (videoIds: string[]) => {
  const {
    data: { items }
  } = await youtubeApi.get("/videos", {
    params: {
      id: videoIds.join()
    }
  });

  const videos: VideoDataMap = items.reduce(
    (videos: VideoDataMap, video: any) => {
      videos[video.id] = video;
      return videos;
    },
    {}
  );
  return videos;
};

export const getPlaylistAndVideos = async () => {
  const {
    data: { nodes, headId }
  } = await getLinkedListData();

  const videoIds = getVideoIds({ nodes, headId });

  const videos = await getVideosDataByIds(videoIds);
  return { videos, playlist: { nodes, headId } as PlaylistData };
};
