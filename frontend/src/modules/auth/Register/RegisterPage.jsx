import {
  Box,
  Button,
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Link,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { PATH } from "../../../routes/path";
import { useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import { password, rePassword } from "../../../constants";
import { useForm } from "react-hook-form";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import { useMutation } from "@tanstack/react-query";
import userApi from "../../../apis/user.api";
import toast from "react-hot-toast";

const GradientBtn = styled(Button)({
  width: "100%",
  textTransform: "none",
  fontSize: 16,
  fontWeight: 500,
  padding: "8px 12px",
  border: "1px solid",
  lineHeight: 1.5,
  backgroundColor: "#4158D0",
  backgroundImage:
    "linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)",
  borderColor: "#0063cc",
  "&:hover": {
    backgroundColor: "#0069d9",
    borderColor: "#0062cc",
  },
  "&:active": {
    boxShadow: "none",
    backgroundColor: "#0062cc",
    borderColor: "#005cbf",
  },
});

const schema = Joi.object({
  username: Joi.string()
    .trim()
    .min(6)
    .max(50)
    .required()
    .invalid("admin")
    .invalid("root")
    .invalid("superuser")
    .messages({
      "string.empty": "Vui lòng nhập tên đăng nhập",
      "string.min": "Tối thiểu 6 ký tự",
      "string.max": "Tối đa 50 ký tự",
      "any.required": "Vui lòng nhập tên đăng nhập",
      "any.invalid": "Tên người dùng này không được phép sử dụng",
    }),
  name: Joi.string().min(2).max(100).required().messages({
    "string.empty": "Vui lòng nhập tên của bạn",
    "string.min": "Tối thiểu 2 ký tự",
    "string.max": "Tối đa 100 ký tự",
    "any.required": "Vui lòng nhập tên của bạn",
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } }) // Disable TLD checking for simplicity
    .required()
    .messages({
      "string.empty": "Vui lòng nhập email",
      "string.email": "Email không hợp lệ",
      "any.required": "Vui lòng nhập email",
    }),
  password: Joi.string()
    .min(8) // Minimum length
    .max(32) // Maximum length
    .required()
    .messages({
      "string.min": "Mật khẩu phải dài ít nhất 8 ký tự",
      "string.max": "Mật khẩu không thể vượt quá 32 ký tự",
      "any.required": "Vui lòng nhập mật khẩu",
      "string.empty": "Vui lòng nhập mật khẩu",
    }),
  rePassword: Joi.string().valid(Joi.ref("password")).required().messages({
    "string.empty": "Vui lòng nhập lại mật khẩu",
    "any.required": "Vui lòng nhập lại mật khẩu",
    "any.only": "Mật khẩu không khớp",
  }),
});

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      name: "",
      email: "",
      password: "",
      rePassword: "",
    },
    resolver: joiResolver(schema),
  });

  const { mutate: handleRegisterUser } = useMutation({
    mutationFn: (formValues) => userApi.register(formValues),
    onSuccess: (res) => {
      console.log("👉 ~ RegisterPage ~ res:", res);
      toast.success(res.message);
      navigate(PATH.LOGIN);
    },
    onError: (err) => {
      console.log("👉 ~ RegisterPage ~ err:", err);
      toast.error(err.data.message || "Đăng ký thất bại. Vui lòng thử lại");
    },
  });

  const handleTogglePassword = (field) => {
    field === password
      ? setShowPassword((show) => !show)
      : setShowRePassword((show) => !show);
  };

  const onSubmit = (formValues) => {
    const { rePassword, ...submitData } = formValues;
    handleRegisterUser(submitData);
  };

  return (
    <Container maxWidth={"sm"}>
      <Typography
        sx={{ fontWeight: 600, textAlign: "center" }}
        component="h3"
        variant="h4"
        gutterBottom
      >
        Đăng ký
      </Typography>
      <Typography textAlign={"center"} variant="body2">
        Bạn đã có tài khoản?{" "}
        <Link
          sx={{ cursor: "pointer" }}
          onClick={() => {
            navigate(PATH.LOGIN);
          }}
          variant="body2"
        >
          Đăng nhập
        </Link>
      </Typography>
      <Box component={"form"} mt={1} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} p={1}>
          <FormControl variant="standard">
            <InputLabel
              sx={{ fontSize: 18 }}
              htmlFor="username"
              error={!!errors.username}
            >
              Tên đăng nhập
            </InputLabel>
            <Input
              id="username"
              name="username"
              fullWidth
              {...register("username")}
              error={!!errors.username}
              startAdornment={
                <InputAdornment position="start">
                  <AccountCircleIcon />
                </InputAdornment>
              }
            />
            {errors.username && (
              <FormHelperText component={"p"} sx={{ color: "red" }}>
                {errors.username.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl variant="standard">
            <InputLabel
              sx={{ fontSize: 18 }}
              htmlFor="name"
              error={!!errors.name}
            >
              Họ và tên
            </InputLabel>
            <Input
              id="name"
              name="name"
              fullWidth
              {...register("name")}
              error={!!errors.name}
              startAdornment={
                <InputAdornment position="start">
                  <PersonIcon />
                </InputAdornment>
              }
            />
            {errors.name && (
              <FormHelperText component={"p"} sx={{ color: "red" }}>
                {errors.name.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl variant="standard">
            <InputLabel
              sx={{ fontSize: 18 }}
              htmlFor="email"
              error={!!errors.email}
            >
              Email
            </InputLabel>
            <Input
              id="email"
              name="email"
              fullWidth
              {...register("email")}
              error={!!errors.email}
              startAdornment={
                <InputAdornment position="start">
                  <AlternateEmailIcon />
                </InputAdornment>
              }
            />
            {errors.email && (
              <FormHelperText component={"p"} sx={{ color: "red" }}>
                {errors.email.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl variant="standard">
            <InputLabel
              sx={{ fontSize: 18 }}
              htmlFor="password"
              error={!!errors.password}
            >
              Mật khẩu
            </InputLabel>
            <Input
              id="password"
              name="password"
              fullWidth
              error={!!errors.password}
              {...register("password")}
              type={showPassword ? "text" : "password"}
              startAdornment={
                <InputAdornment position="start">
                  <LockIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      handleTogglePassword(password);
                    }}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.password && (
              <FormHelperText component={"p"} sx={{ color: "red" }}>
                {errors.password.message}
              </FormHelperText>
            )}
          </FormControl>

          <FormControl variant="standard">
            <InputLabel
              sx={{ fontSize: 18 }}
              htmlFor="rePassword"
              error={!!errors.rePassword}
            >
              Nhập lại mật khẩu
            </InputLabel>
            <Input
              id="rePassword"
              name="rePassword"
              fullWidth
              error={!!errors.rePassword}
              {...register("rePassword")}
              type={showRePassword ? "text" : "password"}
              startAdornment={
                <InputAdornment position="start">
                  <PasswordIcon />
                </InputAdornment>
              }
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      handleTogglePassword(rePassword);
                    }}
                  >
                    {showRePassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            {errors.rePassword && (
              <FormHelperText component={"p"} sx={{ color: "red" }}>
                {errors.rePassword.message}
              </FormHelperText>
            )}
          </FormControl>
          <GradientBtn
            // loading={isPending}
            // disabled={isPending}
            loadingPosition="start"
            variant="contained"
            type="submit"
          >
            Đăng ký
          </GradientBtn>
        </Stack>
      </Box>
    </Container>
  );
}
