import React from "react";
import { VideoItem } from "../VideoItem/VideoItem";
import { PlaylistContainerStyled } from "./Playlist.styled";
import { VideoDataMap } from "../../apiService/apiService";
import ListItem from "@material-ui/core/ListItem";
import { ListItemIcon, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { VideoNode } from "../../../../shared/video-types";
import { List } from "react-movable";

interface PlayListProps {
  videos: VideoDataMap;
  playlistArray: VideoNode[];
  onVideoSelected: (itemId: string) => void;
  removeVideo: (itemId: string) => void;
  updatePlaylistArray: ({
    oldIndex,
    newIndex
  }: {
    oldIndex: number;
    newIndex: number;
  }) => void;
}

interface PlayListItemProps {
  video: any;
  itemId: string;
  onVideoSelected: (itemId: string) => void;
  removeVideo: (itemId: string) => void;
}

const PlaylistItem = ({
  itemId,
  video,
  onVideoSelected,
  removeVideo
}: PlayListItemProps) => (
  <ListItem>
    <ListItemIcon>
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={() => removeVideo(itemId)}
      >
        <DeleteIcon />
      </IconButton>
    </ListItemIcon>
    <VideoItem
      key={itemId}
      video={video}
      handleVideoSelect={() => onVideoSelected(itemId)}
    />
  </ListItem>
);

export const Playlist = ({
  videos,
  onVideoSelected,
  removeVideo,
  updatePlaylistArray,
  playlistArray
}: PlayListProps) => {
  return (
    <List
      values={playlistArray}
      onChange={({ oldIndex, newIndex }) => {
        // const draggedItemId = playlistArray[oldIndex].id;
        // const targetItemId = playlistArray[newIndex].id;
        // const positionType: PositionType =
        //   oldIndex > newIndex ? "before" : "after";
        updatePlaylistArray({ oldIndex, newIndex });
      }}
      renderList={({ children, props }) => (
        <PlaylistContainerStyled {...props}>{children}</PlaylistContainerStyled>
      )}
      renderItem={({ value: videoItem, props }) => (
        <div {...props}>
          <PlaylistItem
            video={videos[videoItem.data.videoId]}
            onVideoSelected={onVideoSelected}
            removeVideo={removeVideo}
            itemId={videoItem.id}
          />
        </div>
      )}
    />
  );
};
