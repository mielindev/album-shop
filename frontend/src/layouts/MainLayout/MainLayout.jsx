import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../../components/Header/Header";
import { Box, Container } from "@mui/material";
import { PATH } from "../../routes/path";
import Footer from "../../components/Footer/Footer";

export default function MainLayout({ children }) {
  // const navItems = ["Distribute Music", "Artist", "Product"];
  const navItems = [
    { title: "User", path: PATH.USER_MANAGE },
    { title: "Artist", path: PATH.ARTIST_MANAGE },
    { title: "Product", path: PATH.PRODUCT_MANAGE },
    { title: "Label", path: PATH.LABEL_MANAGE },
  ];
  return (
    <Box
      sx={{
        background: "linear-gradient(to right , #a770ef, #cf8bf3, #fdb99b)",
      }}
    >
      <Container>
        <Header navItems={navItems} />
        {children}
        <Outlet />
      </Container>
      <Footer />
    </Box>
  );
}
