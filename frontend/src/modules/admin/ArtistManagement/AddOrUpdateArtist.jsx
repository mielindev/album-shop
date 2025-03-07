import React, { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function AddOrUpdateArtist({
  open,
  handleClose,
  onSubmit,
  dataEdit,
}) {
  const inputRef = useRef(null);

  const { register, handleSubmit, setValue, watch } = useForm({
    defaultValues: {
      name: "",
      bio: "",
      image: null,
    },
  });

  const fieldImage = watch("image");

  const previewImage = (file) => {
    if (typeof file === "string" && file.startsWith("http")) {
      return file;
    }
    const url = file ? URL.createObjectURL(file) : "";
    return url;
  };

  useEffect(() => {
    if (dataEdit) {
      setValue("name", dataEdit.name);
      setValue("bio", dataEdit.bio);
      setValue("image", dataEdit.image);
    }
  }, [dataEdit]);

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle fontSize={24} fontWeight={600}>
        {dataEdit ? "Cập nhật thông tin nghệ sĩ" : "Thêm nghệ sĩ"}
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
                    className="w-full h-full object-contain"
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
          <Button type="submit">{dataEdit ? "Cập nhật" : "Thêm"}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
