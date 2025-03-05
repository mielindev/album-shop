import React from "react";
import { Box, Container, Typography, IconButton } from "@mui/material";
import { Facebook, Twitter, Instagram } from "@mui/icons-material";

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#000",
        color: "white",
        py: 3,
        mt: 5,
        textAlign: "center",
      }}
    >
      <Typography variant="h6" sx={{ mb: 1 }}>
        Chill Music
      </Typography>

      {/* Social Media Links */}
      <Box>
        <IconButton color="inherit">
          <Facebook />
        </IconButton>
        <IconButton color="inherit">
          <Twitter />
        </IconButton>
        <IconButton color="inherit">
          <Instagram />
        </IconButton>
      </Box>

      {/* Copyright */}
      <Typography variant="body2" sx={{ mt: 2 }}>
        © {new Date().getFullYear()} My Website. All rights reserved.
      </Typography>
    </Box>
  );
}
