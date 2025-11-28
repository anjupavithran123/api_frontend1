// main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { EnvironmentProvider } from "./contexts/EnvironmentContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <EnvironmentProvider>
      <App />
    </EnvironmentProvider>
  </React.StrictMode>
);
