import { Button, styled } from "@mui/material";

export const GradientBtn = styled(Button)({
  width: "100%",
  textTransform: "none",
  fontSize: 16,
  fontWeight: 600,
  color: "#fff",
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
