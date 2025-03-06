import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logOut } from "../../../store/slices/user.slice";

const StyledAppBar = styled(AppBar)({
  background: "linear-gradient(to right , #a770ef, #cf8bf3, #fdb99b)",
  boxShadow: "none",
});

export default function Header() {
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
    <StyledAppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          width: "90%",
          m: "0 auto",
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
      </Toolbar>
    </StyledAppBar>
  );
}
