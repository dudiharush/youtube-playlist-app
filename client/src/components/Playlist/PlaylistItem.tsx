import ListItem from "@material-ui/core/ListItem";
import { ListItemIcon, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import React from "react";
import { VideoDetails } from "../VideoItem/VideoDetails";

interface PlayListItemProps {
  video: any;
  itemId: string;
  onVideoSelected: (itemId: string) => void;
  removeVideo: (itemId: string) => void;
}

export const PlaylistItem = ({
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
    <VideoDetails
      key={itemId}
      video={video}
      handleVideoSelect={() => onVideoSelected(itemId)}
    />
  </ListItem>
);
