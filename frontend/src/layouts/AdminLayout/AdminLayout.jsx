import { Box, CssBaseline, Toolbar } from "@mui/material";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useSelector } from "react-redux";
import Slidebar from "./_components/Slidebar";
import Header from "./_components/Header";

export default function AdminLayout({ children }) {
  const currentUser = useSelector((state) => state.user.currentUser);
  if (!currentUser) {
    return <Navigate to={PATH.LOGIN} />;
  } else if (currentUser.role !== 2) {
    return <Navigate to={PATH.HOME} />;
  }

  return (
    <Box display={"flex"}>
      <CssBaseline />
      <Header />
      <Slidebar />
      <Box width={"100%"} p={2}>
        <Toolbar />
        {children}
        <Outlet />
      </Box>
    </Box>
  );
}
