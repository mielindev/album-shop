import React from "react";
import { useRoutes } from "react-router-dom";
import { PATH } from "./path";
import AuthLayout from "../layouts/AuthLayout/AuthLayout";
import LoginPage from "../modules/auth/Login/LoginPage";
import RegisterPage from "../modules/auth/Register/RegisterPage";
import MainLayout from "../layouts/MainLayout/MainLayout";
import HomePage from "../modules/home/HomePage/HomePage";
import AdminLayout from "../layouts/AdminLayout/AdminLayout";
import UserManagement from "../modules/admin/UserManagement/UserManagement";
import AdminPage from "../modules/admin/AdminPage/AdminPage";
import ArtistManagement from "../modules/admin/ArtistManagement/ArtistManagement";
import ProductManagement from "../modules/admin/ProductManagement/ProductManagement";
export default function useRouteElement() {
  const element = useRoutes([
    {
      path: PATH.AUTH,
      element: <AuthLayout />,
      children: [
        {
          path: PATH.LOGIN,
          element: <LoginPage />,
        },
        {
          path: PATH.REGISTER,
          element: <RegisterPage />,
        },
      ],
    },
    {
      path: PATH.HOME,
      element: <MainLayout />,
      children: [
        {
          index: true,
          element: <HomePage />,
        },
      ],
    },
    {
      path: PATH.ADMIN,
      element: <AdminLayout />,
      children: [
        {
          index: true,
          element: <AdminPage />,
        },
        {
          path: PATH.USER_MANAGE,
          element: <UserManagement />,
        },
        {
          path: PATH.ARTIST_MANAGE,
          element: <ArtistManagement />,
        },
        {
          path: PATH.PRODUCT_MANAGE,
          element: <ProductManagement />,
        },
      ],
    },
  ]);
  return element;
}
