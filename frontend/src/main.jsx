import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";

import "./index.css";
import App from "./App.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <MantineProvider
      defaultColorScheme="dark"
      theme={{
        primaryColor: "blue",
        fontFamily: "Poppins",
      }}
    >
      <App />
    </MantineProvider>
  </StrictMode>
);