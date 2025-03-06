import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid2,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import artistApi from "../../apis/artist.api";
import { CollapseText } from "../../styles/textStyleCollapse";

export default function ArtistList() {
  const { data: res, error } = useQuery({
    queryKey: ["artistList"],
    queryFn: artistApi.getArtistList,
  });
  const artistData = res?.data || [];
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
        artist
      </Typography>
      <Grid2 container spacing={2}>
        {artistData.map((item) => (
          <Grid2 key={item.id} size={3}>
            <Card sx={{ borderRadius: 1 }}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  sx={{ height: 300 }}
                  image={item.image}
                  alt={item.name}
                />
                <CardContent
                  sx={{
                    background: "rgba(255,255,255,.9)",
                  }}
                >
                  <Typography gutterBottom variant="h5" component="div">
                    {item.name}
                  </Typography>
                  <CollapseText variant="body2">{item.bio}</CollapseText>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}
