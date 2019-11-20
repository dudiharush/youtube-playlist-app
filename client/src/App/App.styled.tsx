import styled from "styled-components";

export const AppContainerStyled = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

export const AppContentContainerStyled = styled.div`
  display: flex;
  flex-direction: row;
  height: 80%;
`;

export const VideoPlayerContainerStyled = styled.div`
  display: flex;
  align-items: center;
  min-width: 800px;
  justify-content: center;
  border: 1px solid black;
  width: 100%;
  margin-inline-start: 20px;
`;

export const SideBarContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  width: 500px;
  border-right: 1px solidblack;
  border: 1px solid black;
`;
