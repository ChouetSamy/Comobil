
//import { useState } from 'react'
import NotFound from "./page/NotFound";
import AppLayout from "./layout/AppLayout";
import EditProfile from "./page/EditProfile";
import { Route, Routes } from "react-router-dom";
import About from "./page/About";
import { useAuth } from "./context/AuthContext";
import Home from "./page/Home";
import TripHistory from "./page/TripHistory";
import CreateTrip from "./page/CreateTrip";
import Profile from "./page/Profile";
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
                <Route
                    path="/profile/edit"
                    element={<EditProfile />}
                />
                <Route path="*" element={<NotFound />} />
                <Route path="/" element={<Home />} />
                <Route path="/trips/history" element={<TripHistory />} />
                <Route path="/trips/create" element={<CreateTrip />} />
                <Route path="/profile" element={<Profile />} />
                <Route
                    path="/trips/search"
                    element={<SearchResult />}
                />
            </Route>
            <Route
                path="/history"
                element={<TripHistory />}
            />
            <Route
                path="/about"
                element={<About />}
            />
        </Routes>
    );
}



