import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  Avatar,
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Pagination,
  Stack,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { StyledTableCell, StyledTableRow } from "../../../styles/tableStyles";
import artistApi from "../../../apis/artist.api";
import { CollapseText } from "../../../styles/textStyleCollapse";
import toast from "react-hot-toast";
import { PATH } from "../../../routes/path";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { GradientBtn } from "../../../styles/mainButtonStyles";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import imageApi from "../../../apis/image.api";
import AddOrUpdateArtist from "./AddOrUpdateArtist";
import AddIcon from "@mui/icons-material/Add";

export default function ArtistManagement() {
  const [isAddOrUpdate, setIsAddOrUpdate] = useState(false);
  const [page, setPage] = useState(1);
  const [dataEdit, setDataEdit] = useState(null);
  console.log("👉 ~ ArtistManagement ~ dataEdit:", dataEdit);
  const [isDelete, setIsDelete] = useState(false);
  const [artist, setArtist] = useState(null);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    data: res,
    isLoading: isLoadingArtistList,
    isError: isErrorArtistList,
  } = useQuery({
    queryKey: ["artistList", page],
    queryFn: () => artistApi.getArtistList({ page }),
  });

  const artistList = res?.data || [];
  const count = res?.total_pages || 1;

  const { mutate: mutateHandleDeleteArtist } = useMutation({
    mutationFn: (id) => artistApi.deleteArtist(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.refetchQueries(["artistList", page]);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: mutateHandleRemoveImage } = useMutation({
    mutationFn: (url) => imageApi.removeImage(url),
    onSuccess: (res) => {
      console.log("👉 ~ ArtistManagement ~ res:", res);
    },
    onError: (err) => {
      console.log("👉 ~ ArtistManagement ~ err:", err);
    },
  });

  const { mutate: handleAddArtist, isPending: isAddingArtist } = useMutation({
    mutationFn: (formValues) => artistApi.addArtist(formValues),
    onSuccess: (res) => {
      toast.success(res.message);
      setIsAddOrUpdate(false);
      queryClient.refetchQueries(["artistList", page]);
    },
    onError: (err) => {
      toast.error(err.data.message);
      setIsAddOrUpdate(false);
    },
  });

  const { mutateAsync: handleUploadImage, isPending: isUploadingImage } =
    useMutation({
      mutationFn: (file) => imageApi.uploadImage(file),
    });

  // Add or Update
  const handleOpenAddOrUpdate = () => {
    setIsAddOrUpdate(true);
  };

  const handleCloseAddOrUpdate = () => {
    setIsAddOrUpdate(false);
    setDataEdit(null);
  };

  // Change a page
  const handleChangePage = (event, value) => {
    setPage(value);
  };

  // Confirn Delete Artist
  const handleCloseDelete = () => {
    setIsDelete(false);
  };

  const handleConfirmDelete = () => {
    mutateHandleDeleteArtist(artist.id);
    mutateHandleRemoveImage(artist.image);
    handleCloseDelete();
  };

  const { mutate: mutateUpdateArtist } = useMutation({
    mutationFn: ({ id, payload }) => artistApi.updateArtist({ id, payload }),
    onSuccess: (res) => {
      toast.success(res.message);
      setIsAddOrUpdate(false);
      queryClient.refetchQueries(["artistList", page]);
    },
    onError: (err) => {
      toast.error(err.data.message);
      setIsAddOrUpdate(false);
    },
  });

  const onSubmit = async (formValues) => {
    try {
      let imageUrl = formValues.image || "";

      if (formValues.image instanceof File) {
        const formData = new FormData();
        formData.append("image", formValues.image);
        const uploadResponse = await handleUploadImage(formData);
        imageUrl = uploadResponse.imageUrl;
      }

      const artistData = {
        ...formValues,
        name: formValues.name,
        bio: formValues.bio,
        image: imageUrl,
      };

      if (dataEdit) {
        mutateUpdateArtist({ id: dataEdit.id, payload: artistData });
        toast.success("Cập nhật nghệ sĩ thành công!");
      } else {
        handleAddArtist(artistData);
        toast.success("Thêm nghệ sĩ thành công!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Thao tác không thành công");
    }
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
          <Stack direction={"row"} alignContent={"center"}>
            <HomeIcon sx={{ width: 20, height: 20 }} fontSize="inherit" />
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
              Dashboard
            </Link>
          </Stack>
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
        <GradientBtn
          sx={{ width: 200 }}
          onClick={handleOpenAddOrUpdate}
          startIcon={<AddIcon />}
        >
          Thêm
        </GradientBtn>
      </Stack>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.modal + 1 })}
        open={isAddingArtist || isUploadingImage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableContainer component={Paper}>
        {!isLoadingArtistList && isErrorArtistList ? (
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
        ) : (
          <Box>
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
                        <IconButton
                          onClick={() => {
                            setDataEdit(artist);
                            setIsAddOrUpdate(true);
                          }}
                        >
                          <ModeEditIcon sx={{ color: "#F2B80F" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setIsDelete(true);
                            setArtist(artist);
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
            <Stack direction={"row"} justifyContent={"flex-end"} mt={2}>
              <Pagination
                count={count}
                page={page}
                onChange={handleChangePage}
                shape="rounded"
              />
            </Stack>
          </Box>
        )}
      </TableContainer>

      {/* Confirm Delete Artist */}
      <Dialog
        open={isDelete}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có muốn xoá nghệ sĩ này không?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hành động này sẽ xoá vĩnh viễn nghệ sĩ khỏi hệ thống. Bạn có chắc
            chắn muốn tiếp tục?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={"contained"} onClick={handleCloseDelete}>
            Hủy
          </Button>
          <Button variant={"contained"} onClick={handleConfirmDelete} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>

      {/* Add or Update Artist */}
      <AddOrUpdateArtist
        open={isAddOrUpdate}
        handleClose={handleCloseAddOrUpdate}
        onSubmit={onSubmit}
        dataEdit={dataEdit}
      />
    </Box>
  );
}
