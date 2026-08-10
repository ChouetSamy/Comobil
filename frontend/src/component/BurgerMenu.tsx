
import {
    Bell,
    CarFront,
    History,
    Home,
    LogIn,
    LogOut,
    Mail,
    Search,
    UserRound,
    X,
} from "lucide-react";
import { Link } from "react-router-dom";

interface BurgerMenuProps {
    isOpen: boolean;
    isAuthenticated: boolean;
    onClose: () => void;
    onLogout?: () => void;
}


const authenticatedLinks = [
    { to: "/", label: "Accueil", icon: Home },
    {
        to: "/trips/search",
        label: "Rechercher un trajet",
        icon: Search,
    },
    {
        to: "/trips/create",
        label: "Créer un trajet",
        icon: CarFront,
    },
    {
        to: "/trips/history",
        label: "Historique",
        icon: History,
    },
    { to: "/messages", label: "Messagerie", icon: Mail },
    {
        to: "/notifications",
        label: "Notifications",
        icon: Bell,
    },
    { to: "/profile", label: "Profil", icon: UserRound },
];

export default function BurgerMenu({
    isOpen,
    isAuthenticated,
    onClose,
    onLogout,
}: BurgerMenuProps) {
    if (!isOpen) {
        return null;
    }
 
    return (
        <div className="fixed inset-0 z-50">
            <button
                type="button"
                aria-label="Fermer le menu"
                onClick={onClose}
                className="absolute inset-0 bg-black/40"
            />

            <aside
                aria-label="Menu principal"
                className="
                    absolute right-0 top-0 flex h-full
                    w-72 flex-col bg-white p-4 shadow-xl
                "
            >
                <div className="mb-6 flex items-center justify-between">
                    <strong className="text-lg text-zinc-800">
                        Menu
                    </strong>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Fermer le menu principal"
                        className="rounded-full p-1 hover:bg-zinc-100"
                    >
                        <X size={22} />
                    </button>
                </div>

                <nav className="flex flex-col gap-1">
                    {(isAuthenticated
                        ? authenticatedLinks
                        : [
                            {
                                to: "/",
                                label: "Accueil",
                                icon: Home,
                            },
                            {
                                to: "/login",
                                label: "Connexion",
                                icon: LogIn,
                            },
                        ]
                    ).map(({ to, label, icon: Icon }) => (
                        <Link
                            key={to}
                            to={to}
                            onClick={onClose}
                            className="
                                flex items-center gap-3
                                rounded-lg px-3 py-3
                                text-zinc-700 hover:bg-zinc-100
                            "
                        >
                            <Icon size={20} />
                            {label}
                        </Link>
                    ))}
                </nav>

                {isAuthenticated && (
                    <button
                        type="button"
                        onClick={() => {
                            onLogout?.();
                            onClose();
                        }}
                        className="
                            mt-auto flex items-center gap-3
                            rounded-lg px-3 py-3
                            text-red-600 hover:bg-red-50
                        "
                    >
                        <LogOut size={20} />
                        Déconnexion
                    </button>
                )}
            </aside>
        </div>
    );
}