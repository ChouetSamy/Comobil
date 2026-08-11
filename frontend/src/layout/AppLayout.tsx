import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import logo from "../assets/Comobil_Logo.png";

import AppHeader from "../component/AppHeader";
import BottomNav from "../component/BottomNav";
import BurgerMenu from "../component/BurgerMenu";

import type { CurrentUser } from "../component/AppHeader";

interface AppLayoutProps {
    user?: CurrentUser | null;
    onLogout?: () => void;
    unreadMessages?: number;
    unreadNotifications?: number;
}

export default function AppLayout({
    user,
    onLogout,
    unreadMessages = 0,
    unreadNotifications = 0,
}: AppLayoutProps) {
    const [menuOpen, setMenuOpen] = useState(false);

    const navigate = useNavigate();

    const handleLogout = () => {
        onLogout?.();
        setMenuOpen(false);
        navigate("/");
    };

    return (
        <div className="min-h-dvh w-full bg-white">
            <div className="mx-auto min-h-dvh w-full max-w-[768px]">
                <AppHeader
                    logo={logo}
                    user={user}
                    unreadMessages={unreadMessages}
                    unreadNotifications={unreadNotifications}
                    onMenuClick={() => setMenuOpen(true)}
                />

                <main className="pb-16">
                    <Outlet />
                </main>

                <BottomNav />

                <BurgerMenu
                    isOpen={menuOpen}
                    isAuthenticated={Boolean(user)}
                    onClose={() => setMenuOpen(false)}
                    onLogout={handleLogout}
                />
            </div>
        </div>
    );
}