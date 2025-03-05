import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import productApi from "../../apis/product.api";

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1551963831-b3b1ca40c98e",
    title: "Breakfast",
  },
  {
    img: "https://images.unsplash.com/photo-1551782450-a2132b4ba21d",
    title: "Burger",
  },
  {
    img: "https://images.unsplash.com/photo-1522770179533-24471fcdba45",
    title: "Camera",
  },
  {
    img: "https://images.unsplash.com/photo-1444418776041-9c7e33cc5a9c",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1533827432537-70133748f5c8",
    title: "Hats",
  },
  {
    img: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62",
    title: "Honey",
  },
  {
    img: "https://images.unsplash.com/photo-1516802273409-68526ee1bdd6",
    title: "Basketball",
  },
  {
    img: "https://images.unsplash.com/photo-1518756131217-31eb79b20e8f",
    title: "Fern",
  },
  {
    img: "https://images.unsplash.com/photo-1597645587822-e99fa5d45d25",
    title: "Mushrooms",
  },
  {
    img: "https://images.unsplash.com/photo-1567306301408-9b74779a11af",
    title: "Tomato basil",
  },
  {
    img: "https://images.unsplash.com/photo-1471357674240-e1a485acb3e1",
    title: "Sea star",
  },
  {
    img: "https://images.unsplash.com/photo-1589118949245-7d38baf380d6",
    title: "Bike",
  },
];

export default function ProductList() {
  const { data: res, error } = useQuery({
    queryKey: ["productList"],
    queryFn: productApi.getListProduct,
  });
  const imageProdut = res?.data || [];
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        sx={{
          background: "rgba(0,0,0,0.8)",
          color: "#fff",
          textAlign: "center",
          textTransform: "uppercase",
          textDecoration: "underline",
          borderRadius: 20,
          p: 1,
          mb: 1,
        }}
        variant="h4"
        component={"h3"}
      >
        album
      </Typography>
      <ImageList cols={4} rowHeight={"auto"} gap={12} sx={{ p: 4 }}>
        {imageProdut.map((item) => (
          <ImageListItem
            key={item.image}
            sx={{
              cursor: "pointer",
              transition: "transform 0.3s ease-in-out",
              borderRadius: 5,
              "&:hover": {
                transform: "scale(1.1)",
              },
            }}
          >
            <img
              srcSet={`${item.image}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
              src={`${item.image}?w=164&h=164&fit=crop&auto=format`}
              alt={item.title}
              loading="lazy"
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
