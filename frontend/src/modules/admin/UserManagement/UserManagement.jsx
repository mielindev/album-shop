import React, { forwardRef, useState } from "react";
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
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { StyledTableCell, StyledTableRow } from "../../../styles/tableStyles";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";

export default function UserManagement() {
  const [open, setOpen] = useState(false);
  const [userID, setUserID] = useState(null);
  console.log("👉 ~ UserManagement ~ userID:", userID);
  const { control, handleSubmit, setValue } = useForm({
    defaultValues: {
      role: null,
    },
  });

  const queryClient = useQueryClient();
  const {
    data: res,
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["getUserList"],
    queryFn: userApi.getUserList,
  });
  const { mutate: handleLockUser } = useMutation({
    mutationFn: (id) => userApi.lockUser(id),
    onSuccess: (res) => {
      console.log("👉 ~ UserManagement ~ res:", res);
      queryClient.invalidateQueries({ queryKey: ["getUserList"] });
    },
    onError: (err) => {
      console.log("👉 ~ UserManagement ~ err:", err);
    },
  });

  const { mutate: mutateUpdateUser } = useMutation({
    mutationFn: ({ id, payload }) => userApi.updateUser({ id, payload }),
    onSuccess: (res) => {
      console.log("👉 ~ UserManagement ~ res:", res);
      toast.success(res.message);
      queryClient.refetchQueries(["getUserList"]);
    },
    onError: (err) => {
      console.log("👉 ~ UserManagement ~ err:", err);
      toast.error(err.message);
    },
  });
  const userList = res?.data || [];
  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (isError) {
    return (
      <Box
        sx={{
          width: "100%",
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography
          textAlign={"center"}
          component={"h3"}
          variant={"h4"}
          fontWeight={600}
          fontStyle={"italic"}
        >
          {error.message}
        </Typography>
      </Box>
    );
  }

  const handleClose = () => {
    setOpen(false);
    setUserID(null);
  };

  const onsubmit = (formValues) => {
    console.log(userID);
    const data = {
      ...formValues,
      role: parseInt(formValues.role, 10),
    };
    console.log("👉 ~ onsubmit ~ data:", data);
    mutateUpdateUser({ id: userID, payload: data });
    handleClose();
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        {userList.length !== 0 ? (
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>ID</StyledTableCell>
                <StyledTableCell align="center">Tài khoản</StyledTableCell>
                <StyledTableCell align="center">Họ và tên</StyledTableCell>
                <StyledTableCell align="center">Email</StyledTableCell>
                <StyledTableCell align="center">Số điện thoại</StyledTableCell>
                <StyledTableCell align="center">Hình đại diện</StyledTableCell>
                <StyledTableCell align="center">Vai trò</StyledTableCell>
                <StyledTableCell align="center">Hoạt động</StyledTableCell>
                <StyledTableCell align="center">Thao tác</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user) => (
                <StyledTableRow key={user.id}>
                  <StyledTableCell component="th" scope="row">
                    {user.id}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {user.username}
                  </StyledTableCell>
                  <StyledTableCell align="center">{user.name}</StyledTableCell>
                  <StyledTableCell align="center">{user.email}</StyledTableCell>
                  <StyledTableCell align="center">
                    {user?.phone || "NaN"}
                  </StyledTableCell>
                  <StyledTableCell
                    sx={{ display: "flex", justifyContent: "center" }}
                    align="center"
                  >
                    <Avatar src={user.avatar} />
                  </StyledTableCell>
                  <StyledTableCell align="center">{user.role}</StyledTableCell>
                  <StyledTableCell align="center">
                    {user.is_locked ? (
                      <FiberManualRecordIcon sx={{ color: "red" }} />
                    ) : (
                      <FiberManualRecordIcon sx={{ color: "green" }} />
                    )}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Stack direction={"row"} justifyContent={"center"}>
                      <IconButton
                        onClick={() => {
                          setOpen(true);
                          setUserID(user.id);
                          setValue("role", user.role);
                        }}
                      >
                        <ModeEditIcon sx={{ color: "#F2B80F" }} />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          handleLockUser(user.id);
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

      <Dialog open={open} keepMounted onClose={handleClose}>
        <DialogTitle>{"Chỉnh sửa vai trò của người dùng"}</DialogTitle>
        <DialogContent>
          <FormControl>
            <Controller
              name="role"
              control={control}
              rules={{ required: "Vui lòng chọn vai trò" }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value={1}
                    control={<Radio />}
                    label="User"
                  />
                  <FormControlLabel
                    value={2}
                    control={<Radio />}
                    label="Admin"
                  />
                </RadioGroup>
              )}
            />
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Huỷ</Button>
          <Button onClick={handleSubmit(onsubmit)}>Lưu</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
