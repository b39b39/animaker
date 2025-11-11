import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import DevApp from "./dev/App";
import DBApp from "./dev/DBApp"
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<App />} />
                <Route path="/dev" element={<DevApp />} />
                <Route path="/test" element={<DBApp />} />
            </Routes>
        </BrowserRouter>
    </React.StrictMode>
);

