import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useQuery } from "@tanstack/react-query";
import genreApi from "../../../apis/genre.api";
import formatApi from "../../../apis/format.api";

export default function AddOrUpdateProduct({
  open,
  handleClose,
  onSubmit,
  dataEdit,
}) {
  const inputRef = useRef(null);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      artist: "",
      label: "",
      release_at: null,
      description: "",
      image: null,
      genres: [],
      formats: [{ format_id: "", price: "", stock: "", old_price: "" }],
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

  const { data: dataGenre } = useQuery({
    queryKey: ["getGenreList"],
    queryFn: genreApi.getGenreList,
  });

  const availableGenres = dataGenre?.data || [];

  const { data: dataFormat } = useQuery({
    queryKey: ["getFormatList"],
    queryFn: formatApi.getFormatList,
  });

  const availableFormats = dataFormat?.data || [];

  const { fields, append, remove } = useFieldArray({
    control,
    name: "formats",
  });

  const addNewFormat = () => {
    append({ format_id: "", price: "", stock: "", old_price: "" });
  };

  useEffect(() => {
    if (dataEdit) {
      setValue("name", dataEdit.name || "");
      setValue("artist", dataEdit.artist?.name || dataEdit.artist || "");
      setValue("label", dataEdit.label?.name || dataEdit.label || "");
      setValue("release_at", dataEdit.release_at || null);
      setValue("description", dataEdit.description || "");
      setValue("image", dataEdit.image || null);
      setValue(
        "genres",
        dataEdit.genres?.map((item) =>
          item.genre_id ? item.genre_id : item
        ) || []
      );
      setValue(
        "formats",
        dataEdit.format_details?.length > 0
          ? dataEdit.format_details.map((item) => ({
              format_id: item.format.id || "",
              price: item.price || "",
              stock: item.stock || "",
              old_price: item.old_price || "",
            }))
          : [{ format_id: "", price: "", stock: "", old_price: "" }]
      );
    }
  }, [dataEdit]);
  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <DialogTitle fontSize={24} fontWeight={600}>
        {dataEdit ? "Cập nhật thông tin sản phẩm" : "Thêm sản phẩm"}
      </DialogTitle>
      <Box component={"form"}>
        <DialogContent>
          <Stack spacing={2}>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Tên sản phẩm không được bỏ trống" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tên sản phẩm"
                  fullWidth
                  margin="normal"
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
              )}
            />
            <Controller
              name="artist"
              control={control}
              rules={{ required: "Tác giả không được bỏ trống" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tác giả"
                  fullWidth
                  margin="normal"
                  error={!!errors.artist}
                  helperText={errors.artist?.message}
                />
              )}
            />
            <Controller
              name="label"
              control={control}
              rules={{ required: "Nhà phát hành không được để trống" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Nhà phát hành"
                  fullWidth
                  margin="normal"
                  error={!!errors.label}
                  helperText={errors.label?.message}
                />
              )}
            />
            <Controller
              name="release_at"
              control={control}
              rules={{
                required: "Năm phát hành không được bỏ trống",
                min: {
                  value: 1900,
                  message: "Năm phát hành phải lớn hơn 1900",
                },
                max: {
                  value: 2100,
                  message: "Năm phát hành phải nhỏ hơn 2100",
                },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Năm phát hành"
                  type="number"
                  fullWidth
                  margin="normal"
                  error={!!errors.release_at}
                  helperText={errors.release_at?.message}
                  inputProps={{ min: 1900, max: 2100 }}
                />
              )}
            />
            <Controller
              name="description"
              control={control}
              rules={{ required: "Mô tả không được bỏ trống" }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Mổ tả"
                  multiline
                  rows={5}
                  fullWidth
                  margin="normal"
                  error={!!errors.label}
                  helperText={errors.label?.message}
                />
              )}
            />
            <FormControl fullWidth margin="normal" error={!!errors.genres}>
              <InputLabel id="genres-label">Thể loại</InputLabel>
              <Controller
                name="genres"
                control={control}
                rules={{ required: "Chọn ít nhất một thể loại" }}
                render={({ field }) => (
                  <Select
                    {...field}
                    labelId="genres-label"
                    multiple
                    onChange={(e) => field.onChange(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((value) => {
                          const genre = availableGenres.find(
                            (g) => g.id === value
                          );
                          return (
                            <Chip key={value} label={genre?.name || value} />
                          );
                        })}
                      </Box>
                    )}
                  >
                    {availableGenres.map((genre) => (
                      <MenuItem key={genre.id} value={genre.id}>
                        {genre.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.genres && (
                <Box sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}>
                  {errors.genres.message}
                </Box>
              )}
            </FormControl>

            <Box sx={{ mb: 2 }}>
              <h3>Định dạng</h3>
              {fields.map((field, index) => (
                <Box
                  key={field.id}
                  sx={{
                    mb: 2,
                    p: 2,
                    border: 1,
                    borderRadius: 1,
                    borderColor: "grey.300",
                    position: "relative",
                  }}
                >
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Loại định dạng</InputLabel>
                    <Controller
                      name={`formats.${index}.format_id`}
                      control={control}
                      rules={{ required: "Định dạng không được bỏ trống" }}
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors.formats?.[index]?.format_id}
                          onChange={(e) => {
                            field.onChange(e.target.value);
                          }}
                        >
                          {availableFormats.map((format) => (
                            <MenuItem
                              key={format.id}
                              value={parseInt(format.id, 10)}
                            >
                              {format.name}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                    {errors.formats?.[index]?.format_id && (
                      <Box
                        sx={{ color: "error.main", fontSize: "0.75rem", mt: 1 }}
                      >
                        {errors.formats[index].format_id.message}
                      </Box>
                    )}
                  </FormControl>

                  <Controller
                    name={`formats.${index}.price`}
                    control={control}
                    rules={{ required: "Giá không được để trống", min: 0 }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Giá"
                        type="number"
                        fullWidth
                        margin="normal"
                        error={!!errors.formats?.[index]?.price}
                        helperText={errors.formats?.[index]?.price?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`formats.${index}.stock`}
                    control={control}
                    rules={{
                      required: "Số tồn kho không được để trống",
                      min: 0,
                    }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Tồn kho"
                        type="number"
                        fullWidth
                        margin="normal"
                        error={!!errors.formats?.[index]?.stock}
                        helperText={errors.formats?.[index]?.stock?.message}
                      />
                    )}
                  />

                  <Controller
                    name={`formats.${index}.old_price`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Giá cũ"
                        type="number"
                        fullWidth
                        margin="normal"
                      />
                    )}
                  />

                  {fields.length > 1 && (
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => remove(index)}
                      sx={{ mt: 1 }}
                    >
                      Xoá định dạng
                    </Button>
                  )}
                </Box>
              ))}

              {/* Add Format Button */}
              <Button
                type="button"
                variant="outlined"
                color="primary"
                onClick={addNewFormat}
                sx={{ mt: 1 }}
              >
                Thêm định dạng khác
              </Button>
            </Box>
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
          <Button variant="contained" onClick={handleClose}>
            Huỷ
          </Button>
          <Button
            variant="contained"
            type="submit"
            onClick={handleSubmit(onSubmit)}
          >
            {dataEdit ? "Cập nhật" : "Thêm"}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
