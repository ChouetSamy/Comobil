import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

type HistoryTab = "upcoming" | "past" | "mine";

interface City {
    commune?: string;
}

interface Address {
    street?: string;
    city?: City | string;
}

interface Trip {
    id: number;
    departureDatetime: string;
    estimatedArrivalDatetime: string;
    totalPrice?: number;
    pricePerPassenger?: number;
    availableSeats?: number;
    departureAddress?: Address | string;
    arrivalAddress?: Address | string;
}

interface TripCollection {
    member?: Trip[];
    "hydra:member"?: Trip[];
}

export default function TripHistory() {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] =
        useState<HistoryTab>("upcoming");

    const [upcomingTrips, setUpcomingTrips] =
        useState<Trip[]>([]);

    const [pastTrips, setPastTrips] =
        useState<Trip[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const token =
        localStorage.getItem("token");

    useEffect(() => {
        const loadHistory = async () => {
            setLoading(true);
            setError("");

            try {
                const [
                    upcomingResponse,
                    pastResponse,
                ] = await Promise.all([
                    fetch(
                        `${API_URL}/api/my-trips/upcoming`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                Accept:
                                    "application/ld+json",
                            },
                        },
                    ),

                    fetch(
                        `${API_URL}/api/my-trips/past`,
                        {
                            headers: {
                                Authorization:
                                    `Bearer ${token}`,
                                Accept:
                                    "application/ld+json",
                            },
                        },
                    ),
                ]);

                if (
                    !upcomingResponse.ok
                    || !pastResponse.ok
                ) {
                    throw new Error(
                        "Impossible de charger l'historique.",
                    );
                }

                const upcomingData:
                    TripCollection =
                    await upcomingResponse.json();

                const pastData:
                    TripCollection =
                    await pastResponse.json();

                setUpcomingTrips(
                    upcomingData.member
                    ?? upcomingData["hydra:member"]
                    ?? [],
                );

                setPastTrips(
                    pastData.member
                    ?? pastData["hydra:member"]
                    ?? [],
                );
            } catch (caughtError) {
                setError(
                    caughtError instanceof Error
                        ? caughtError.message
                        : "Une erreur est survenue.",
                );
            } finally {
                setLoading(false);
            }
        };

        void loadHistory();
    }, []);

    const trips =
        activeTab === "past"
            ? pastTrips
            : upcomingTrips;

    return (
        <div className="w-full bg-white pb-20">
            {/* Tabs */}
            <nav
                className="
                    grid
                    grid-cols-3
                    bg-zinc-800
                    text-[11px]
                    text-white
                "
            >
                <button
                    type="button"
                    onClick={() =>
                        setActiveTab("upcoming")
                    }
                    className={`
                        h-10
                        ${
                            activeTab === "upcoming"
                                ? "bg-sky-600"
                                : "bg-zinc-800"
                        }
                    `}
                >
                    à venir
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActiveTab("past")
                    }
                    className={`
                        h-10
                        border-x
                        border-zinc-700
                        ${
                            activeTab === "past"
                                ? "bg-sky-600"
                                : "bg-zinc-800"
                        }
                    `}
                >
                    passé
                </button>

                <button
                    type="button"
                    onClick={() =>
                        setActiveTab("mine")
                    }
                    className={`
                        h-10
                        ${
                            activeTab === "mine"
                                ? "bg-sky-600"
                                : "bg-zinc-800"
                        }
                    `}
                >
                    Mes trajets
                </button>
            </nav>

            {/* Content */}
            <main
                className="
                    mx-auto
                    w-full
                    max-w-[520px]
                    px-6
                    py-5
                "
            >
                {loading && (
                    <p
                        className="
                            py-8
                            text-center
                            text-sm
                            text-zinc-500
                        "
                    >
                        Chargement...
                    </p>
                )}

                {error && (
                    <p
                        className="
                            rounded
                            bg-red-50
                            p-3
                            text-sm
                            text-red-600
                        "
                    >
                        {error}
                    </p>
                )}

                {!loading
                    && !error
                    && trips.length === 0 && (
                    <p
                        className="
                            py-8
                            text-center
                            text-sm
                            text-zinc-500
                        "
                    >
                        Aucun trajet.
                    </p>
                )}

                {!loading
                    && !error
                    && (
                    <div className="space-y-3">
                        {trips.map((trip) => (
                            <TripTicket
                                key={trip.id}
                                trip={trip}
                                onClick={() =>
                                    navigate(
                                        `/trips/${trip.id}`,
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

function TripTicket({
    trip,
    onClick,
}: {
    trip: Trip;
    onClick: () => void;
}) {
    const departureDate =
        new Date(
            trip.departureDatetime,
        );

    const arrivalDate =
        new Date(
            trip.estimatedArrivalDatetime,
        );

    const departureCity =
        getCity(
            trip.departureAddress,
        );

    const arrivalCity =
        getCity(
            trip.arrivalAddress,
        );

    const departureStreet =
        getStreet(
            trip.departureAddress,
        );

    const arrivalStreet =
        getStreet(
            trip.arrivalAddress,
        );

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                block
                w-full
                border
                border-zinc-300
                bg-white
                text-left
                shadow-sm
            "
        >
            {/* Link row */}
            <div
                className="
                    flex
                    h-7
                    items-center
                    justify-between
                    px-3
                    text-[10px]
                    text-zinc-700
                "
            >
                <span>
                    Voir le trajet
                </span>

                <span>
                    &gt;&gt;
                </span>
            </div>

            {/* Main trip infos */}
            <div className="px-4 pb-4">
                <div
                    className="
                        grid
                        grid-cols-2
                        gap-6
                    "
                >
                    <div>
                        <h2
                            className="
                                text-[22px]
                                font-bold
                                leading-tight
                                text-zinc-700
                            "
                        >
                            {departureCity}
                        </h2>

                        <p
                            className="
                                mt-2
                                min-h-8
                                text-[10px]
                                leading-tight
                                text-zinc-600
                            "
                        >
                            {departureStreet}
                        </p>
                    </div>

                    <div>
                        <h2
                            className="
                                text-[22px]
                                font-bold
                                leading-tight
                                text-zinc-700
                            "
                        >
                            {arrivalCity}
                        </h2>

                        <p
                            className="
                                mt-2
                                min-h-8
                                text-[10px]
                                leading-tight
                                text-zinc-600
                            "
                        >
                            {arrivalStreet}
                        </p>
                    </div>
                </div>

                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-6
                    "
                >
                    <div>
                        <p
                            className="
                                text-[10px]
                                text-zinc-500
                            "
                        >
                            Départ
                        </p>

                        <p
                            className="
                                text-[30px]
                                font-light
                                leading-none
                                text-zinc-700
                            "
                        >
                            {formatTime(
                                departureDate,
                            )}
                        </p>
                    </div>

                    <div>
                        <p
                            className="
                                text-[10px]
                                text-zinc-500
                            "
                        >
                            Arrivée estimée
                        </p>

                        <p
                            className="
                                text-[30px]
                                font-light
                                leading-none
                                text-zinc-700
                            "
                        >
                            {formatTime(
                                arrivalDate,
                            )}
                        </p>
                    </div>
                </div>
            </div>

            {/* Blue price block */}
            <div
                className="
                    bg-sky-600
                    px-4
                    py-3
                    text-white
                "
            >
                <div
                    className="
                        grid
                        grid-cols-2
                        items-end
                        gap-4
                    "
                >
                    <div>
                        <p
                            className="
                                text-[9px]
                                leading-none
                            "
                        >
                            actuellement
                        </p>

                        <div
                            className="
                                mt-1
                                flex
                                items-end
                                gap-2
                            "
                        >
                            <span
                                className="
                                    text-[28px]
                                    font-bold
                                    leading-none
                                "
                            >
                                {formatPrice(
                                    trip.pricePerPassenger,
                                )}
                                €
                            </span>

                            <span
                                className="
                                    pb-1
                                    text-[12px]
                                "
                            >
                                / pers.
                            </span>
                        </div>

                        <p
                            className="
                                mt-1
                                text-[11px]
                            "
                        >
                            👥{" "}
                            {trip.availableSeats ?? 0}
                        </p>
                    </div>

                    <div>
                        <p
                            className="
                                text-[12px]
                                uppercase
                            "
                        >
                            Coût du trajet
                        </p>

                        <p
                            className="
                                text-[36px]
                                font-light
                                leading-none
                            "
                        >
                            {formatPrice(
                                trip.totalPrice,
                            )}
                            €
                        </p>
                    </div>
                </div>

                <p
                    className="
                        mt-2
                        text-[9px]
                    "
                >
                    {formatPrice(
                        trip.pricePerPassenger,
                    )}
                    € par personne si trajet complet
                </p>
            </div>
        </button>
    );
}

function getCity(
    address?: Address | string,
): string {
    if (!address) {
        return "—";
    }

    if (typeof address === "string") {
        return "—";
    }

    if (
        typeof address.city === "object"
        && address.city !== null
    ) {
        return (
            address.city.commune
            ?? "—"
        );
    }

    return "—";
}

function getStreet(
    address?: Address | string,
): string {
    if (!address) {
        return "";
    }

    if (typeof address === "string") {
        return "";
    }

    return address.street ?? "";
}

function formatTime(
    date: Date,
): string {
    if (
        Number.isNaN(
            date.getTime(),
        )
    ) {
        return "--:--";
    }

    return date.toLocaleTimeString(
        "fr-FR",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        },
    );
}

function formatPrice(
    value?: number,
): string {
    if (
        value === undefined
        || value === null
        || Number.isNaN(value)
    ) {
        return "0";
    }

    return Number.isInteger(value)
        ? value.toString()
        : value.toFixed(2);
}