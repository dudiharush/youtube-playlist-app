import axios from "axios";
import youtubeApi from "./youtubeApi";
import { LinkedListData } from "../../../shared/types";
import { getVideoIds } from "../utils";
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

export const removeVideoId = (videoId: string) =>
  instance.patch(
    "/playlist",
    { op: "remove" },
    {
      params: {
        videoId
      }
    }
  );

export const getLinkedListData = () =>
  instance.get<LinkedListData>("/playlist");

export const getVideosDataByIds = async (videoIds: string[]) => {
  const response = await youtubeApi.get("/videos", {
    params: {
      id: videoIds.join()
    }
  });
  const videos: VideoDataMap = response.data.reduce(
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
  return { videos, playlist: { nodes, headId } as LinkedListData };
};
