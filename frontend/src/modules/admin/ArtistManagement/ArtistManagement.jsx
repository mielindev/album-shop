import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import userApi from "../../../apis/user.api";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Avatar,
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";
import { StyledTableCell, StyledTableRow } from "../../../styles/tableStyles";
import artistApi from "../../../apis/artist.api";
import { CollapseText } from "../../../styles/textStyleCollapse";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { GradientBtn } from "../../../styles/mainButtonStyles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useRef } from "react";
import imageApi from "../../../apis/image.api";

export default function ArtistManagement() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const { register, handleSubmit, reset, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      bio: "",
      image: null,
    },
  });

  const {
    data: res,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["artistList"],
    queryFn: () => artistApi.getArtistList({ page: 1, pageSize: 20 }),
  });

  const artistList = res?.data || [];

  const { mutate: handleDeleteArtist } = useMutation({
    mutationFn: (id) => artistApi.deleteArtist(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["artistList"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const fieldImage = watch("image");

  const previewImage = (file) => {
    const url = file ? URL.createObjectURL(file) : "";
    return url;
  };

  const { mutate: handleAddArtist } = useMutation({
    mutationFn: (formValues) => artistApi.addArtist(formValues),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries({ queryKey: ["artistList"] });
    },
    onError: (err) => {
      toast.error(err.data.message);
    },
  });

  const { mutateAsync: handleUploadImage } = useMutation({
    mutationFn: (file) => imageApi.uploadImage(file),
  });

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  const onSubmit = async (formValues) => {
    console.log("👉 ~ onSubmit ~ formValues:", formValues);
    try {
      let imageUrl = "";

      if (formValues.image) {
        const formData = new FormData();
        formData.append("image", formValues.image);
        const uploadResponse = await handleUploadImage(formData);
        imageUrl = uploadResponse.imageUrl;
      }

      handleAddArtist({
        ...formValues,
        name: formValues.name,
        bio: formValues.bio,
        image: imageUrl,
      });
    } catch (error) {
      console.error("Error:", error);
      toast.error("Thêm nghệ nghĩ không thành công");
    }

    handleClose();
  };

  return (
    <Box>
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        p={2}
      >
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            sx={{
              cursor: "pointer",
            }}
            underline="hover"
            color="inherit"
            onClick={() => {
              navigate(PATH.ADMIN);
            }}
          >
            <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
            Home
          </Link>
          <Link
            sx={{
              cursor: "pointer",
            }}
            underline="hover"
            color="text.primary"
            onClick={() => {
              navigate(PATH.ARTIST_MANAGE);
            }}
            aria-current="page"
          >
            Artist Manage
          </Link>
        </Breadcrumbs>
        <GradientBtn sx={{ width: 200 }} onClick={handleOpen}>
          Thêm
        </GradientBtn>
      </Stack>

      <Dialog fullWidth open={open} onClose={handleClose}>
        <DialogTitle fontSize={24} fontWeight={600}>
          {"Thêm nghệ sĩ"}
        </DialogTitle>
        <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField
                id="name"
                name="name"
                {...register("name")}
                required
                fullWidth
                label="Tên nghệ sĩ"
                variant={"filled"}
              />
              <TextField
                id="bio"
                name="bio"
                multiline
                {...register("bio")}
                required
                fullWidth
                rows={5}
                label="Tiểu sử"
                variant={"filled"}
              />
              <Box
                width={"100%"}
                height={200}
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#E8E8E8",
                  borderRadius: 2,
                  border: "1px dashed black",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                onClick={() => {
                  !fieldImage && inputRef.current.click();
                }}
              >
                {fieldImage ? (
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      position: "relative",
                    }}
                  >
                    <IconButton
                      sx={{
                        position: "absolute",
                        top: 4,
                        right: 4,
                        zIndex: 10,
                      }}
                      onClick={() => {
                        setValue("image", null);
                      }}
                    >
                      <DeleteIcon sx={{ color: "red", fontSize: 24 }} />
                    </IconButton>
                    <img
                      src={previewImage(fieldImage)}
                      className="w-full h-full object-fill"
                    />
                  </Box>
                ) : (
                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"center"}
                    spacing={1}
                  >
                    <CloudUploadIcon sx={{ width: 30, height: 30 }} />
                    <Typography
                      component={"h3"}
                      variant={"button"}
                      fontWeight={600}
                    >
                      Upload Files
                    </Typography>
                  </Stack>
                )}
              </Box>
            </Stack>
            <input
              accept=".png, .jpg, .jpeg"
              type="file"
              hidden
              ref={inputRef}
              onChange={(event) => {
                setValue("image", event.target.files[0]);
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Huỷ</Button>
            <Button type="submit">Thêm</Button>
          </DialogActions>
        </Box>
      </Dialog>

      <TableContainer component={Paper}>
        {artistList.length !== 0 ? (
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell width={120} align="center">
                  Nghệ danh
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ width: 700 }}>
                  Tiểu sử
                </StyledTableCell>
                <StyledTableCell align="center">Hình ảnh</StyledTableCell>
                <StyledTableCell align="center">Thao tác</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {artistList.map((artist) => (
                <StyledTableRow key={artist.id}>
                  <StyledTableCell component="th" scope="row">
                    {artist.id}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {artist.name}
                  </StyledTableCell>
                  <StyledTableCell align="left">
                    <CollapseText>{artist.bio}</CollapseText>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Avatar
                      sx={{ m: "0 auto", width: 60, height: 60 }}
                      alt={artist.name}
                      src={artist.image}
                    />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Stack direction={"row"} justifyContent={"center"}>
                      <IconButton>
                        <ModeEditIcon sx={{ color: "#F2B80F" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          handleDeleteArtist(artist.id);
                        }}
                      >
                        <DeleteIcon sx={{ color: "#F70000" }} />
                      </IconButton>
                    </Stack>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography
            display={"flex"}
            alignItems={"center"}
            justifyContent={"center"}
            height={"80vh"}
            component={"h3"}
            variant={"h4"}
            fontWeight={600}
            fontStyle={"italic"}
          >
            Không có dữ liệu
          </Typography>
        )}
      </TableContainer>
    </Box>
  );
}
