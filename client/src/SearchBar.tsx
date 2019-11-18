import React from 'react';
import { Button, TextField } from "@material-ui/core";
interface SearchBarProps {
    onInputChange:(event: any)=>void;
    onAddClick:()=>void;
}

export const SearchBar = ({onInputChange, onAddClick}: SearchBarProps) => {
    return (
        <div style={{justifyContent: 'center', display: "flex", flexDirection: "row", height:'7vh', marginBottom:'10px' }}>
            <TextField
              onChange={event => onInputChange(event.target.value)}
              id="outlined-secondary"
              placeholder='Enter video URL'
              type="search"
              margin="dense"
              variant="outlined"
              color="secondary"
            />
            <Button
              style={{ marginTop: "6px" }}
              variant="contained"
              onClick={onAddClick}
            >
              add
            </Button>
          </div>
    )
}


