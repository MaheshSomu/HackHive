import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import "./index.css";

import AuthProvider from "./context/authContext";
import { NotificationProvider } from "./context/NotificationContext";
import { Toaster } from "./components/ui/sonner";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationProvider>
        <App />
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  </React.StrictMode>
);