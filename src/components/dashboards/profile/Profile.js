import React from "react";
import User from "./User";
import Questions from "./Questions";
import { styled } from "@mui/material/styles";
import { Paper } from "@mui/material";

const MainContainer = styled(Paper)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  padding: theme.spacing(2),
  margin: "auto",
  width: "100%",
  maxWidth: "800px",
  height: "100%",
  backgroundColor: theme.palette.background.paper,
}));

const Profile = () => {
  return (
    <MainContainer>
      <User />
      <Questions />
    </MainContainer>
  );
};

export default Profile;
