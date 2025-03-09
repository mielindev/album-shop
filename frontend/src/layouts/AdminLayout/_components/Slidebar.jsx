import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar,
} from "@mui/material";
import { People, MusicNote, ShoppingCart, Label } from "@mui/icons-material";
import { NavLink } from "react-router-dom";
import { PATH } from "../../../routes/path";
const sidebarWidth = 260;
export default function Slidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: sidebarWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: sidebarWidth,
          boxSizing: "border-box",
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: "auto" }}>
        <List sx={{ p: 0 }}>
          {/* User Management */}
          <ListItemButton
            component={NavLink}
            to={PATH.USER_MANAGE}
            sx={{ "&.active": { backgroundColor: "#F5F5F5" } }}
          >
            <ListItemIcon>
              <People />
            </ListItemIcon>
            <ListItemText primary="User Management" />
          </ListItemButton>

          {/* Artist Management */}
          <ListItemButton
            component={NavLink}
            to={PATH.ARTIST_MANAGE}
            sx={{ "&.active": { backgroundColor: "#F5F5F5" } }}
          >
            <ListItemIcon>
              <MusicNote />
            </ListItemIcon>
            <ListItemText primary="Artist Management" />
          </ListItemButton>

          {/* Product Management */}
          <ListItemButton
            component={NavLink}
            to={PATH.PRODUCT_MANAGE}
            sx={{ "&.active": { backgroundColor: "#F5F5F5" } }}
          >
            <ListItemIcon>
              <ShoppingCart />
            </ListItemIcon>
            <ListItemText primary="Product Management" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}
