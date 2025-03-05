import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { Box, Stack, styled } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../store/slices/user.slice";
import { useQuery } from "@tanstack/react-query";
import userApi from "../../apis/user.api";

const StyledAppBar = styled(AppBar)({
  background: "transparent",
  boxShadow: "none",
  padding: "8px 0",
});

const NavButton = styled(Button)({
  color: "#ffffff",
  marginRight: "20px",
  textTransform: "none",
  fontSize: "18px",
  fontWeight: 600,
  "&:hover": {
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  },
});

const JoinButton = styled(Button)({
  backgroundColor: "#e60000",
  color: "#ffffff",
  borderRadius: "20px",
  padding: "6px 20px",
  fontSize: "14px",
  textTransform: "none",
  "&:hover": {
    backgroundColor: "#cc0000",
  },
});

export default function Header({ navItems }) {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const currentUser = useSelector((state) => state.user.currentUser);
  const firstLetter = currentUser?.name?.charAt(0)?.toUpperCase() || "";

  const { data, isPending, isError } = useQuery({
    queryKey: ["currentUser"],
    // queryFn: () => userApi.getProfile(currentUser.id),
  });
  // console.log("👉 ~ Header ~ data:", data);

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <StyledAppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Avatar
            sx={{ width: 60, height: 60, cursor: "pointer" }}
            alt="logo"
            src="/shop-logo.png"
          />
          <Typography
            variant="h6"
            component="h1"
            sx={{
              textAlign: "center",
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            Chill Music
          </Typography>
        </Stack>

        <Box sx={{ display: "flex", alignItems: "center" }}>
          {navItems?.map((item) => (
            <NavButton
              onClick={() => {
                navigate(item.path);
              }}
              key={item.path}
              size="small"
            >
              {item.title}
            </NavButton>
          ))}
        </Box>

        <Box minWidth={120}>
          {currentUser ? (
            <Box>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    sx={{
                      bgcolor: "#e60000",
                      color: "white",
                      fontWeight: 600,
                    }}
                    alt={currentUser.name}
                  >
                    {firstLetter}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={handleCloseUserMenu}>
                  <Typography sx={{ textAlign: "center" }}>Profile</Typography>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    dispatch(logOut());
                  }}
                >
                  <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <JoinButton
              size="small"
              edge="end"
              color="inherit"
              aria-label="join"
              onClick={() => {
                navigate(PATH.REGISTER);
              }}
            >
              Join us 🌐
            </JoinButton>
          )}
        </Box>
      </Toolbar>
    </StyledAppBar>
  );
}
