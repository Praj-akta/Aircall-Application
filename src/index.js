import './css/body.css';
import './css/app.css';
import './css/header.css';
import './css/activities.css';
import './css/activityDetails.css';
import React from "react";
import App from './App.js';
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("app");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
