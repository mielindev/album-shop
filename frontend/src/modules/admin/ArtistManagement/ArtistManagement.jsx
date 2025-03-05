import React from "react";
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
import { Box, IconButton, Stack } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import LockIcon from "@mui/icons-material/Lock";

export default function ArtistManagement() {
  return <div>ArtistManagement</div>;
}
