import { Toaster } from "react-hot-toast";
import useRouteElement from "./routes/useRouteElement";
import { CssBaseline } from "@mui/material";

function App() {
  const routerElements = useRouteElement();

  return (
    <>
      {routerElements}
      <CssBaseline />
      <Toaster />
    </>
  );
}

export default App;
