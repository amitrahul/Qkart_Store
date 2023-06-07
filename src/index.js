import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@emotion/react";
import theme from "./theme";

import { SnackbarProvider } from "notistack";

// TODO: CRIO_TASK_MODULE_REGISTER - Add Target container ID (refer public/index.html)
ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
          <SnackbarProvider
            maxSnack={1}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            preventDuplicate
          >
            <App />
          </SnackbarProvider>
          </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
   document.getElementById('root')
);
