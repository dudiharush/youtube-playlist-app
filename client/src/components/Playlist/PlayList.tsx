import React from "react";
import { Video } from "../Video/Video";
import { PlaylistContainerStyled } from "./Playlist.styled";
import { VideoDataMap } from "../../apiService/apiService";
import ListItem from "@material-ui/core/ListItem";
import { ListItemIcon, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { PlaylistData, VideoNode } from "../../../../shared/video-types";
import { List } from "react-movable";
import { PositionType } from "../../../../shared/types";

interface PlayListProps {
  videos: VideoDataMap;
  playlist: PlaylistData;
  onVideoSelected: (itemId: string) => void;
  removeVideo: (itemId: string) => void;
  changeItemPosition: ({
    draggedItemId,
    targetItemId,
    positionType
  }: {
    draggedItemId: string;
    targetItemId: string;
    positionType: PositionType;
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
    <Video
      key={itemId}
      video={video}
      handleVideoSelect={() => onVideoSelected(itemId)}
    />
  </ListItem>
);

export const Playlist = ({
  playlist: { nodes, headId },
  videos,
  onVideoSelected,
  removeVideo,
  changeItemPosition
}: PlayListProps) => {
  const items: VideoNode[] = [];
  if (headId) {
    let currNode = nodes[headId];
    while (currNode) {
      items.push(currNode);
      currNode = nodes[currNode.nextNodeId!];
    }
  }

  return (
    <List
      values={items}
      onChange={({ oldIndex, newIndex }) => {
        const draggedItemId = items[oldIndex].id;
        const targetItemId = items[newIndex].id;
        const positionType: PositionType =
          oldIndex > newIndex ? "before" : "after";

        changeItemPosition({ draggedItemId, targetItemId, positionType });
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
