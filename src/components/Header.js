import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { Link, useHistory } from "react-router-dom";

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();

  const toExploreRoute = () => {
    history.push("/");
  };
  const registerRoute = () => {
    history.push("/register");
  };

  const loginRoute = () => {
    history.push("/login");
  };

  const logOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("balance");

    history.push("/");
    window.location.reload();
  };

  if (hasHiddenAuthButtons) {
    return (
      <Box className="header">
        <Box className="header-title">
          <Link to="/">
            <img src="logo_light.svg" alt="QKart-icon"></img>
          </Link>
          </Box>
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={toExploreRoute}
        >
          Back to explore
        </Button>
      </Box>
    );
  }

  return (
    <Box className="header">
      <Box className="header-title">
        <Link to="/">
          <img src="logo_light.svg" alt="QKart-icon"></img>
        </Link>
      </Box>
      
      {localStorage.getItem("username") ? (
        <>
          {children}
          <Stack direction="row" alignItems="center" spacing={2}>
            <Avatar
              src="avatar.png"
              alt={localStorage.getItem("username") || "avtaar"}
            />
            <p className="username-text">{localStorage.getItem("username")}</p>
            <Button variant="text" onClick={logOut}>
              LOGOUT
            </Button>
          </Stack>
        </>
      ) : (
        <>
          {children}
          <Stack direction="row" alignItems="center" spacing={2}>

            <Button variant="text" onClick={loginRoute}>
              LOGIN
            </Button>

            <Button variant="contained" onClick={registerRoute}>
              REGISTER
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
};

export default Header;
