import {
    Bell,
    CircleUserRound,
    Mail,
    Menu,
} from "lucide-react";
import { Link } from "react-router-dom";

export interface CurrentUser {
    avatarUrl?: string | null;
}

interface AppHeaderProps {
    logo: string;
    user?: CurrentUser | null;
    unreadMessages?: number;
    unreadNotifications?: number;
    onMenuClick: () => void;
}

function NotificationBadge({
    count,
}: {
    count: number;
}) {
    if (count <= 0) {
        return null;
    }

    return (
        <span
            aria-label={`${count} élément(s) non lu(s)`}
            className="
                absolute -right-1 -top-1
                flex min-h-4 min-w-4
                items-center justify-center
                rounded-full bg-red-600
                px-1 text-[10px]
                font-bold leading-none text-white
            "
        >
            {count > 99 ? "99+" : count}
        </span>
    );
}

export default function AppHeader({
    logo,
    user,
    unreadMessages = 0,
    unreadNotifications = 0,
    onMenuClick,
}: AppHeaderProps) {
    return (
        <header
            className="
                sticky top-0 z-40
                flex h-14 w-full
                items-center justify-between
                bg-white px-3
            "
        >
            <Link
                to="/"
                aria-label="Retour à l'accueil"
            >
                <img
                    src={logo}
                    alt="Comobil"
                    className="h-11 w-auto object-contain"
                />
            </Link>

            <nav
                aria-label="Navigation utilisateur"
                className="flex items-center gap-3"
            >
                {/* Notifications */}
                <Link
                    to={user ? "/notifications" : "/login"}
                    aria-label={
                        unreadNotifications
                            ? `${unreadNotifications} notifications non lues`
                            : "Notifications"
                    }
                    className="relative text-sky-600"
                >
                    <Bell
                        size={22}
                        fill="currentColor"
                        strokeWidth={1.8}
                    />

                    <NotificationBadge
                        count={unreadNotifications}
                    />
                </Link>

                {/* Messages */}
                <Link
                    to={user ? "/messages" : "/login"}
                    aria-label={
                        unreadMessages
                            ? `${unreadMessages} messages non lus`
                            : "Messagerie"
                    }
                    className="relative text-zinc-700"
                >
                    <Mail
                        size={23}
                        strokeWidth={2.5}
                    />

                    <NotificationBadge
                        count={unreadMessages}
                    />
                </Link>

                {/* Profile */}
                <Link
                    to={user ? "/profile" : "/login"}
                    aria-label={
                        user
                            ? "Voir mon profil"
                            : "Se connecter"
                    }
                >
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="Photo de profil"
                            className="
                                h-6 w-6
                                rounded-full object-cover
                            "
                        />
                    ) : (
                        <CircleUserRound
                            size={22}
                            strokeWidth={2.5}
                            className={
                                user
                                    ? "text-green-600"
                                    : "text-zinc-700"
                            }
                        />
                    )}
                </Link>

                {/* Burger menu */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Ouvrir le menu principal"
                    className="text-zinc-700"
                >
                    <Menu size={22} />
                </button>
            </nav>
        </header>
    );
}