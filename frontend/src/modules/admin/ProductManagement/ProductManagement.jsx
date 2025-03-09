import {
  Avatar,
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Link,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { GradientBtn } from "../../../styles/mainButtonStyles";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import { PATH } from "../../../routes/path";
import { useNavigate } from "react-router-dom";
import { StyledTableCell, StyledTableRow } from "../../../styles/tableStyles";
import { CollapseText } from "../../../styles/textStyleCollapse";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import productApi from "../../../apis/product.api";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import toast from "react-hot-toast";
import AddOrUpdateProduct from "./AddOrUpdateProduct";
import imageApi from "../../../apis/image.api";

export default function ProductManagement() {
  const [open, setOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [productID, setProductID] = useState(null);
  const [dataEdit, setDataEdit] = useState(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: res,
    isLoading: isLoadingProductList,
    isError: isErrorProductList,
  } = useQuery({
    queryKey: ["productList"],
    queryFn: productApi.getListProduct,
  });

  const { mutate: mutateLockProduct } = useMutation({
    mutationFn: (id) => productApi.lockProduct(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.refetchQueries(["productList"]);
    },
    onError: (err) => {
      toast.success(err.message);
    },
  });

  const { mutate: mutateCreateProduct, isPending: isPendingCreateProduct } =
    useMutation({
      mutationFn: (data) => productApi.createProduct(data),
      onSuccess: (res) => {
        toast.success(res.message);
        queryClient.refetchQueries(["productList"]);
      },
      onError: (err) => {
        toast.success(err.message);
      },
    });

  const { mutateAsync: mutateUploadImage, isPending: isUploadingImage } =
    useMutation({
      mutationFn: (file) => imageApi.uploadImage(file),
    });

  const { mutate: mutateUpdateProduct } = useMutation({
    mutationFn: ({ id, payload }) => productApi.updateProduct({ id, payload }),
    onSuccess: (res) => {
      toast.success(res.message);
      setOpen(false);
      queryClient.refetchQueries(["productList"]);
    },
    onError: (err) => {
      toast.error(err.data.message);
      setOpen(false);
    },
  });

  const productList = res?.data || [];

  const handleCloseLock = () => {
    setIsLocked(false);
    setProductID(null);
  };

  const handleConfirmLock = () => {
    mutateLockProduct(productID);
    handleCloseLock();
  };

  const handleClose = () => {
    setOpen(false);
    setDataEdit(null);
  };

  const onSubmit = async (formValues) => {
    try {
      let imageUrl = formValues.image || "";

      if (formValues.image instanceof File) {
        const formData = new FormData();
        formData.append("image", formValues.image);
        const uploadResponse = await mutateUploadImage(formData);
        imageUrl = uploadResponse.imageUrl;
        formData.append("image", imageUrl);
      }

      const productData = {
        ...formValues,
        image: imageUrl,
        release_at: parseInt(formValues.release_at, 10),
        formats: formValues.formats.map((item) => ({
          format_id: parseInt(item.format_id, 10),
          price: parseInt(item.price, 10),
          stock: parseInt(item.stock, 10),
          old_price: parseInt(item.old_price, 10),
        })),
      };

      if (dataEdit) {
        // Update existing product
        mutateUpdateProduct({ id: dataEdit.id, payload: productData });
        toast.success("Cập nhật sản phẩm thành công!");
      } else {
        // Create new product
        mutateCreateProduct(productData);
        toast.success("Thêm sản phẩm thành công!");
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("Thao tác không thành công");
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
              navigate(PATH.PRODUCT_MANAGE);
            }}
            aria-current="page"
          >
            Product Manage
          </Link>
        </Breadcrumbs>
        <GradientBtn
          sx={{ width: 200 }}
          onClick={() => {
            setOpen(true);
          }}
          startIcon={<AddIcon />}
        >
          Thêm
        </GradientBtn>
      </Stack>

      <Backdrop
        sx={(theme) => ({ color: "#fff", zIndex: theme.zIndex.modal + 1 })}
        open={isPendingCreateProduct || isUploadingImage}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <TableContainer component={Paper}>
        {!isLoadingProductList && isErrorProductList ? (
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
                  <StyledTableCell align="center">Tên sản phẩm</StyledTableCell>
                  <StyledTableCell align="center">Mô tả</StyledTableCell>
                  <StyledTableCell align="center">Năm ra mắt</StyledTableCell>
                  <StyledTableCell align="center">Tác giả</StyledTableCell>
                  <StyledTableCell align="center">Thể loại</StyledTableCell>
                  <StyledTableCell align="center">Hình ảnh</StyledTableCell>
                  <StyledTableCell align="center">Hoạt động</StyledTableCell>
                  <StyledTableCell align="center">Thao tác</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {productList.map((product) => (
                  <StyledTableRow key={product.id}>
                    <StyledTableCell component="th" scope="row">
                      {product.id}
                    </StyledTableCell>
                    <StyledTableCell width={200} align="center">
                      {product.name}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <CollapseText>{product.description}</CollapseText>
                    </StyledTableCell>
                    <StyledTableCell width={200} align="center">
                      {product.release_at}
                    </StyledTableCell>
                    <StyledTableCell width={120} align="center">
                      {product.artist.name}
                    </StyledTableCell>
                    <StyledTableCell width={120} align="center">
                      {product.genres.map(({ genre }) => {
                        return (
                          <Typography key={genre.name}>{genre.name}</Typography>
                        );
                      })}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Avatar
                        sx={{ m: "0 auto", width: 60, height: 60 }}
                        alt={product.name}
                        src={product.image}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ px: 5 }}>
                      {product.active ? (
                        <FiberManualRecordIcon sx={{ color: "green" }} />
                      ) : (
                        <FiberManualRecordIcon sx={{ color: "red" }} />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <Stack direction={"row"} justifyContent={"center"}>
                        <IconButton
                          onClick={() => {
                            setDataEdit(product);
                            setOpen(true);
                          }}
                        >
                          <ModeEditIcon sx={{ color: "#F2B80F" }} />
                        </IconButton>
                        <IconButton
                          onClick={() => {
                            setIsLocked(true);
                            setProductID(product.id);
                          }}
                        >
                          <LockIcon sx={{ color: "#F70000" }} />
                        </IconButton>
                      </Stack>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
            <Stack direction={"row"} justifyContent={"flex-end"} mt={2}>
              <Pagination
                count={1}
                page={1}
                //   onChange={handleChangePage}
                shape="rounded"
              />
            </Stack>
          </Box>
        )}
      </TableContainer>
      {/* Dialog to confirm lock product */}
      <Dialog
        open={isLocked}
        onClose={handleCloseLock}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Bạn có muốn khóa sản phẩm này không?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Hành động này sẽ khóa sản phẩm và ngăn nó được chỉnh sửa hoặc sử
            dụng trong hệ thống. Bạn có chắc chắn muốn tiếp tục?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button variant={"contained"} onClick={handleCloseLock}>
            Hủy
          </Button>
          <Button variant={"contained"} onClick={handleConfirmLock} autoFocus>
            Xác nhận
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog to add or update product */}
      <AddOrUpdateProduct
        open={open}
        handleClose={handleClose}
        onSubmit={onSubmit}
        dataEdit={dataEdit}
      />
    </Box>
  );
}
