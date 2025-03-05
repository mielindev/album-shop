import React from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { PATH } from "../../routes/path";
import { useSelector } from "react-redux";
import { Box } from "@mui/material";

export default function AuthLayout({ children }) {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.user.currentUser);
  if (currentUser) {
    if (currentUser.role === 2) {
      return <Navigate to={PATH.ADMIN} />;
    } else if (currentUser.role === 1) {
      return <Navigate to={PATH.HOME} />;
    }
  }
  return (
    <Box className="w-screen h-screen flex items-center justify-center">
      <Box
        className="rounded-2xl p-8 bg-white"
        sx={{
          boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
        }}
      >
        <Box className="w-full flex items-center justify-center">
          <img
            className="w-52 cursor-pointer"
            src="/shop-logo.png"
            alt="logo"
            onClick={() => {
              navigate(PATH.HOME);
            }}
          />
        </Box>
        {children}
        <Outlet />
      </Box>
    </Box>
  );
}
