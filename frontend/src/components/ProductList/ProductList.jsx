import { Box, ImageList, ImageListItem, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import productApi from "../../apis/product.api";

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
