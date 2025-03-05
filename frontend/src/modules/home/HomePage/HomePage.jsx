import React from "react";
import { Box } from "@mui/material";
import Banner from "../../../components/Banner/Banner";
import ProductList from "../../../components/ProductList/ProductList";
import ArtistList from "../../../components/ArtistList/ArtistList";
export default function HomePage() {
  return (
    <Box>
      <Banner />
      <ProductList />
      <ArtistList />
    </Box>
  );
}
