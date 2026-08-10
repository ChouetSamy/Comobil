import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AppLayout from "./layout/AppLayout";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
//import SearchResult from "./page/SearchResult";
import { Route, Routes } from "react-router-dom";
import './index.css'
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <App />
            </AuthProvider>
        </BrowserRouter>
    </StrictMode>,
);