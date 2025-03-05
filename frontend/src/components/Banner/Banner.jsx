import { Box, styled, Typography } from "@mui/material";
import React from "react";
import Slider from "react-slick";

export default function Banner() {
  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
  };
  const banners = [
    {
      id: 1,
      image:
        "https://res.cloudinary.com/albumshop/image/upload/v1740929273/b47be2cbff959d235e44aa54f027e883_j7ryrs.jpg",
      title: "Banner 1",
    },
    {
      id: 2,
      image:
        "https://res.cloudinary.com/albumshop/image/upload/v1740928948/maxresdefault_vvuzek.jpg",
      title: "Banner 2",
    },
    {
      id: 3,
      image:
        "https://res.cloudinary.com/albumshop/image/upload/v1740929473/maxresdefault_jwxlpi.jpg",
      title: "Banner 3",
    },
  ];
  return (
    <Box
      sx={{
        maxWidth: 1400,
        margin: "auto",
      }}
    >
      <Slider {...settings}>
        {banners.map((banner) => (
          <Box key={banner.id} sx={{ position: "relative" }}>
            <img
              src={banner.image}
              alt={banner.title}
              style={{ width: "100%" }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                height: "100%",
                width: "100%",
                background:
                  "linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.2))", // Gradient overlay
                p: 2, // Padding
                color: "white",
                textAlign: "center",
              }}
            ></Box>
          </Box>
        ))}
      </Slider>
    </Box>
  );
}
