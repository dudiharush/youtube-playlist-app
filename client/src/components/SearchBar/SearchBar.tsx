import React from "react";
import { TextField } from "@material-ui/core";
import { SearchBarContainerStyled, ButtonStyled } from "./SearchBar.styled";
interface SearchBarProps {
  onInputChange: (event: any) => void;
  onAddClick: () => void;
}

export const SearchBar = ({ onInputChange, onAddClick }: SearchBarProps) => {
  return (
    <SearchBarContainerStyled>
      <TextField
        onChange={event => onInputChange(event.target.value)}
        id="outlined-secondary"
        placeholder="Enter video URL"
        type="search"
        margin="dense"
        variant="outlined"
        color="secondary"
      />
      <ButtonStyled
        variant="contained"
        onClick={onAddClick}
      >
        add
      </ButtonStyled>
    </SearchBarContainerStyled>
  );
};
