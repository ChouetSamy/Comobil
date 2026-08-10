import {
    CalendarDays,
    CarFront,
    Search,
    MapPin,
    Plus,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Home() {
    return (
        <div className="bg-white">
            {/* Main search section */}
            <section
                aria-labelledby="home-search-title"
                className="bg-sky-600 px-4 pb-7 pt-6"
            >
                <h1
                    id="home-search-title"
                    className="mb-3 text-2xl font-bold leading-tight text-white"
                >
                    Où allez-vous
                    <br />
                    aujourd&apos;hui ?
                </h1>

                <div className="rounded-2xl bg-white p-3 shadow-lg">
                    <p className="mb-2 text-xs uppercase tracking-wide text-zinc-400">
                        Trouver un trajet
                    </p>

                    <div className="space-y-2">
                        <label className="relative block">
                            <MapPin
                                aria-hidden="true"
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500"
                            />

                            <input
                                type="text"
                                placeholder="Départ"
                                className="
                                    h-11 w-full rounded-xl
                                    border border-zinc-200
                                    bg-zinc-50 pl-9 pr-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label className="relative block">
                            <MapPin
                                aria-hidden="true"
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-red-500"
                            />

                            <input
                                type="text"
                                placeholder="Arrivée"
                                className="
                                    h-11 w-full rounded-xl
                                    border border-zinc-200
                                    bg-zinc-50 pl-9 pr-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label className="relative block">
                            <CalendarDays
                                aria-hidden="true"
                                size={16}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500"
                            />

                            <input
                                type="date"
                                className="
                                    h-11 w-full rounded-xl
                                    border border-zinc-200
                                    bg-zinc-50 pl-9 pr-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>
                    </div>

                    <Link
                        to="/login"
                        className="
                            mt-3 flex h-11 w-full
                            items-center justify-center
                            gap-2 rounded-xl
                            bg-sky-600
                            text-sm font-semibold
                            text-white shadow
                            hover:bg-sky-700
                        "
                    >
                        <Search size={17} aria-hidden="true" />
                        Rechercher un trajet
                    </Link>
                </div>
            </section>

            {/* Description */}
            <section className="px-5 pt-6">
                <p className="text-sm leading-5 text-zinc-800">
                    Tous les jours, vous avez le même trajet que
                    d&apos;autre personne, et si vous le partagiez ?
                    <br />
                    Avec <strong>Comobil</strong>, trouvez vous des
                    compagnons de voyages.
                </p>
            </section>

            {/* Quick actions */}
            <section
                aria-label="Actions principales"
                className="grid grid-cols-3 gap-3 px-5 pt-5"
            >
                <Link
                    to="/login"
                    className="
                        flex min-h-28 flex-col
                        items-center justify-center
                        rounded-2xl bg-blue-50
                        px-2 text-center
                    "
                >
                    <span
                        className="
                            mb-2 flex h-10 w-10
                            items-center justify-center
                            rounded-xl bg-blue-100
                            text-blue-600
                        "
                    >
                        <Plus size={22} aria-hidden="true" />
                    </span>

                    <span className="text-xs font-medium text-blue-600">
                        Créer un trajet
                    </span>
                </Link>

                <Link
                    to="/login"
                    className="
                        flex min-h-28 flex-col
                        items-center justify-center
                        rounded-2xl bg-orange-50
                        px-2 text-center
                    "
                >
                    <span
                        className="
                            mb-2 flex h-10 w-10
                            items-center justify-center
                            rounded-xl bg-orange-100
                            text-orange-500
                        "
                    >
                        <CarFront size={21} aria-hidden="true" />
                    </span>

                    <span className="text-xs font-medium text-orange-500">
                        Mes trajets
                    </span>
                </Link>

                <Link
                    to="/login"
                    className="
                        flex min-h-28 flex-col
                        items-center justify-center
                        rounded-2xl bg-green-50
                        px-2 text-center
                    "
                >
                    <span
                        className="
                            mb-2 flex h-10 w-10
                            items-center justify-center
                            rounded-xl bg-green-100
                            text-green-600
                        "
                    >
                        <CalendarDays size={21} aria-hidden="true" />
                    </span>

                    <span className="text-xs font-medium text-green-600">
                        Historique
                    </span>
                </Link>
            </section>

            {/* Women-only section */}
            <section className="px-5 pb-8 pt-5">
                <p className="text-sm leading-5 text-zinc-800">
                    Les{" "}
                    <strong className="text-pink-600">
                        femmes
                    </strong>{" "}
                    peuvent avoir besoin de sérénités, c&apos;est
                    pour ça que{" "}
                    <strong className="text-sky-600">
                        Comobil
                    </strong>{" "}
                    donne la possibilité aux{" "}
                    <strong className="text-pink-600">
                        femmes
                    </strong>{" "}
                    de reserver leurs trajets aux autre{" "}
                    <strong className="text-pink-600">
                        femmes
                    </strong>{" "}
                    seulement
                </p>

                <Link
                    to="/login"
                    className="
                        mt-4 flex h-11 w-full
                        items-center justify-center
                        gap-2 rounded-xl
                        bg-pink-600
                        text-sm font-semibold
                        text-white shadow
                        hover:bg-pink-700
                    "
                >
                    <Search size={17} aria-hidden="true" />
                    Chercher un trajet réservé aux femmes
                </Link>
            </section>
        </div>
    );
}