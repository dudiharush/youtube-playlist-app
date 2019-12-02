import React from "react";
import { Video } from "../Video/Video";
import { PlaylistContainerStyled } from "./Playlist.styled";
import { VideoDataMap } from "../../apiService/apiService";
import ListItem from "@material-ui/core/ListItem";
import { ListItemIcon, IconButton } from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import { PlaylistData } from "../../../../shared/video-types";

interface PlayListProps {
  videos: VideoDataMap;
  playlist: PlaylistData;
  onVideoSelected: (videoId: string) => void;
  removeVideo: (videoId: string) => void;
}

export const Playlist = ({
  playlist: { nodes, headId },
  videos,
  onVideoSelected,
  removeVideo
}: PlayListProps) => {
  const PlaylistItems = () => {
    const videoElements = [];
    if (headId) {
      let currNode = nodes[headId];
      while (currNode) {
        let {
          id,
          data: { videoId }
        } = currNode;
        videoElements.push(
          <ListItem>
            <ListItemIcon>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={() => removeVideo(id)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemIcon>
            <Video
              key={id}
              video={videos[videoId]}
              handleVideoSelect={() => onVideoSelected(id)}
            />
          </ListItem>
        );
        currNode = nodes[currNode.nextNodeId!];
      }
    }
    return <>{videoElements}</>;
  };

  return (
    <PlaylistContainerStyled>
      <PlaylistItems />
    </PlaylistContainerStyled>
  );
};
