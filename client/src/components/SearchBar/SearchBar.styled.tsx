import styled from "styled-components"
import Button from "@material-ui/core/Button";

export const SearchBarContainerStyled = styled.div`
    align-items: center;
    display: flex;
    justify-content: center;
`;

export const ButtonStyled = styled(Button)`
    margin: 20px;
    height: calc(100%-12px);
    && {
        margin-left: 10px;
    }
`