import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Joi from "joi";
import { joiResolver } from "@hookform/resolvers/joi";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import {
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
} from "@mui/material";
import { PATH } from "../../../routes/path";
import userApi from "../../../apis/user.api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCurrentUser } from "../../../store/slices/user.slice";

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
  username: Joi.string().min(6).max(50).required().messages({
    "string.empty": "Tên đăng nhập không được để trống",
    "string.min": "Tối thiểu 6 ký tự",
    "string.max": "Tối đa 50 ký tự",
    "any.required": "Vui lòng nhập tên đăng nhập",
  }),
  password: Joi.string()
    .min(8) // Minimum length
    .max(32) // Maximum length
    .required()
    .messages({
      "string.min": "Mật khẩu phải dài ít nhất 8 ký tự",
      "string.max": "Mật khẩu không thể vượt quá 32 ký tự",
      "any.required": "Vui lòng nhập mật khẩu",
    }),
});

export default function LoginPage() {
  const [showPassword, setshowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: joiResolver(schema),
  });

  const { mutate: handleLogin, isPending } = useMutation({
    mutationFn: (formValues) => userApi.login(formValues),
    onSuccess: (res) => {
      const currentUser = res.data.user;
      toast.success(res.message);
      dispatch(setCurrentUser(currentUser));
      currentUser.role === 2 ? navigate(PATH.ADMIN) : navigate(PATH.HOME);
    },
    onError: (error) => {
      toast.error(error.message || "Đăng nhập không thành công", {
        position: "top-center",
        style: {
          padding: 12,
          maxWidth: 500,
          textAlign: "right",
          boxShadow:
            "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        },
      });
    },
  });

  const handleShowPassword = () => setshowPassword((show) => !show);

  const onSubmit = (formValues) => {
    handleLogin(formValues);
  };

  return (
    <Container maxWidth={"sm"}>
      <Typography
        sx={{ fontWeight: 600, textAlign: "center" }}
        component="h3"
        variant="h4"
        gutterBottom
      >
        Đăng nhập
      </Typography>
      <Typography textAlign={"center"} variant="body2">
        Chào mừng bạn trở lại👋
      </Typography>
      <Box component={"form"} onSubmit={handleSubmit(onSubmit)}>
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
                  <IconButton onClick={handleShowPassword}>
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
          <Link
            href={PATH.HOME}
            sx={{ cursor: "pointer" }}
            color="action.active"
          >
            Quên mật khẩu?
          </Link>
          <GradientBtn
            loading={isPending}
            disabled={isPending}
            loadingPosition="start"
            variant="contained"
            type="submit"
          >
            Đăng nhập
          </GradientBtn>
        </Stack>
      </Box>
      <Divider>
        <Button
          disabled={isPending}
          sx={{
            fontSize: 14,
            fontWeight: 600,
            color: "action.active",
            textAlign: "center",
            textTransform: "none",
          }}
          onClick={() => {
            navigate(PATH.REGISTER);
          }}
          variant="text"
        >
          Đăng ký
        </Button>
      </Divider>
    </Container>
  );
}
