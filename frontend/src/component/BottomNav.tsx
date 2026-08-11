import {
    CalendarDays,
    CirclePlus,
    Search,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
    {
        to: "/trips/search",
        label: "Rechercher un trajet",
        icon: Search,
    },
    {
        to: "/trips/create",
        label: "Créer un trajet",
        icon: CirclePlus,
    },
    {
        to: "/trips/history",
        label: "Historique des trajets",
        icon: CalendarDays,
    },
];

export default function BottomNav() {
    return (
        <nav
            aria-label="Navigation rapide"
            className="
                fixed bottom-0 left-1/2 z-40
                flex h-14 w-full max-w-[768px]
                -translate-x-1/2
                items-center
                bg-sky-600
            "
        >
            {links.map(({ to, label, icon: Icon }) => (
                <NavLink
                    key={to}
                    to={to}
                    aria-label={label}
                    className="
                        flex h-full flex-1
                        items-center justify-center
                        text-white
                        transition
                        hover:bg-sky-700
                        focus:outline-none
                        focus-visible:bg-sky-700
                    "
                >
                    <Icon
                        aria-hidden="true"
                        size={38}
                        strokeWidth={3}
                    />
                </NavLink>
            ))}
        </nav>
    );
}