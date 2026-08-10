//import { useState } from 'react'
import AppLayout from "./layout/AppLayout";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Home from "./page/Home";
import Login from "./page/Login";
import Register from "./page/Register";
import SearchResult from "./page/SearchResult";
//import './App.css'
import "./index.css";

export default function App() {
    const { user, logout } = useAuth();

    return (
        <Routes>
            {/* Pages without global layout */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Pages with header, burger menu and bottom navigation */}
            <Route
                element={
                    <AppLayout
                        user={user}
                        onLogout={logout}
                    />
                }
            >
                <Route path="/" element={<Home />} />

                <Route
                    path="/trips/search"
                    element={<SearchResult />}
                />
            </Route>
        </Routes>
    );
}



