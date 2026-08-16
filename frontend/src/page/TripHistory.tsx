import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TripCard from "../component/TripCard";
import type {
    Trip as TripCardTrip,
    TripPreference,
} from "../component/TripCard";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

type HistoryTab =
    | "upcoming"
    | "past"
    | "mine";

/* =========================
 * TYPES API
 * ========================= */

interface CityRef {
    id?: number;
    commune?: string;
}

interface AddressRef {
    id?: number;
    street?: string;
    city?: CityRef | string;
}

interface PreferenceRef {
    id?: number;
    description?: string;
}

interface TripPreferenceRef {
    id: number;

    isActive?: boolean;
    active?: boolean;

    preference?:
        | PreferenceRef
        | string;
}

interface ApiTrip {
    id: number;

    departureDatetime: string;
    estimatedArrivalDatetime: string;

    totalPrice?: number;
    pricePerPassenger?: number | null;
    availableSeats?: number;

    tripCreatorRole?: string;

    departureAddress?:
        | AddressRef
        | string;

    arrivalAddress?:
        | AddressRef
        | string;

    tripPreferences?: Array<
        TripPreferenceRef | string
    >;
}

interface TripCollection {
    member?: ApiTrip[];
    "hydra:member"?: ApiTrip[];
}

/* =========================
 * PAGE
 * ========================= */

export default function TripHistory() {
    const navigate =
        useNavigate();

    const token =
        localStorage.getItem("token");

    const [
        activeTab,
        setActiveTab,
    ] =
        useState<HistoryTab>(
            "upcoming",
        );

    const [
        upcomingTrips,
        setUpcomingTrips,
    ] =
        useState<TripCardTrip[]>(
            [],
        );

    const [
        pastTrips,
        setPastTrips,
    ] =
        useState<TripCardTrip[]>(
            [],
        );

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const authHeaders = {
        Authorization:
            `Bearer ${token}`,

        Accept:
            "application/ld+json",
    };

    /* =========================
     * FETCH IRI
     * ========================= */

    const fetchResource =
        async <T,>(
            resource: string,
        ): Promise<T | null> => {
            const url =
                resource.startsWith("http")
                    ? resource
                    : `${API_URL}${resource}`;

            const response =
                await fetch(
                    url,
                    {
                        headers:
                            authHeaders,
                    },
                );

            if (!response.ok) {
                return null;
            }

            return response.json();
        };

    /* =========================
     * ADDRESS
     * ========================= */

    const loadAddress =
        async (
            value?:
                | AddressRef
                | string,
        ): Promise<AddressRef | null> => {
            if (!value) {
                return null;
            }

            let address:
                AddressRef | null;

            if (
                typeof value
                === "string"
            ) {
                address =
                    await fetchResource<AddressRef>(
                        value,
                    );
            } else {
                address = value;
            }

            if (!address) {
                return null;
            }

            if (
                typeof address.city
                === "string"
            ) {
                const city =
                    await fetchResource<CityRef>(
                        address.city,
                    );

                return {
                    ...address,

                    city:
                        city
                        ?? address.city,
                };
            }

            return address;
        };

    /* =========================
     * PREFERENCES
     * ========================= */

    const loadTripPreference =
        async (
            value:
                | TripPreferenceRef
                | string,
        ): Promise<TripPreference | null> => {
            let tripPreference:
                TripPreferenceRef | null;

            if (
                typeof value
                === "string"
            ) {
                tripPreference =
                    await fetchResource<TripPreferenceRef>(
                        value,
                    );
            } else {
                tripPreference =
                    value;
            }

            if (!tripPreference) {
                return null;
            }

            let preference:
                PreferenceRef | null =
                null;

            if (
                typeof tripPreference
                    .preference
                === "string"
            ) {
                preference =
                    await fetchResource<PreferenceRef>(
                        tripPreference
                            .preference,
                    );
            } else if (
                tripPreference
                    .preference
            ) {
                preference =
                    tripPreference
                        .preference;
            }

            if (
                !preference?.id
                || !preference.description
            ) {
                return null;
            }

            return {
                id:
                    tripPreference.id,

                isActive:
                    tripPreference
                        .isActive
                    ?? tripPreference
                        .active
                    ?? true,

                preference: {
                    id:
                        preference.id,

                    description:
                        preference
                            .description,
                },
            };
        };

    /* =========================
     * HYDRATE TRIP
     * ========================= */

    const hydrateTrip =
        async (
            trip: ApiTrip,
        ): Promise<TripCardTrip | null> => {
            const [
                departureAddress,
                arrivalAddress,
            ] =
                await Promise.all([
                    loadAddress(
                        trip.departureAddress,
                    ),

                    loadAddress(
                        trip.arrivalAddress,
                    ),
                ]);

            if (
                !departureAddress
                || !arrivalAddress
            ) {
                return null;
            }

            if (
                typeof departureAddress.city
                    !== "object"
                || departureAddress.city
                    === null
            ) {
                return null;
            }

            if (
                typeof arrivalAddress.city
                    !== "object"
                || arrivalAddress.city
                    === null
            ) {
                return null;
            }

            const preferenceResults =
                await Promise.all(
                    (
                        trip.tripPreferences
                        ?? []
                    ).map(
                        (
                            preference,
                        ) =>
                            loadTripPreference(
                                preference,
                            ),
                    ),
                );

            const tripPreferences =
                preferenceResults.filter(
                    (
                        preference,
                    ): preference is TripPreference =>
                        preference !== null,
                );

            return {
                id:
                    trip.id,

                departureDatetime:
                    trip.departureDatetime,

                estimatedArrivalDatetime:
                    trip.estimatedArrivalDatetime,

                totalPrice:
                    trip.totalPrice
                    ?? 0,

                availableSeats:
                    trip.availableSeats
                    ?? 0,

                tripCreatorRole:
                    trip.tripCreatorRole
                        === "PASSENGER"
                        ? "PASSENGER"
                        : "DRIVER",

                pricePerPassenger:
                    trip.pricePerPassenger
                    ?? 0,

                departureAddress: {
                    street:
                        departureAddress
                            .street
                        ?? "",

                    city: {
                        commune:
                            departureAddress
                                .city
                                .commune
                            ?? "—",
                    },
                },

                arrivalAddress: {
                    street:
                        arrivalAddress
                            .street
                        ?? "",

                    city: {
                        commune:
                            arrivalAddress
                                .city
                                .commune
                            ?? "—",
                    },
                },

                tripPreferences,
            };
        };

    /* =========================
     * LOAD HISTORY
     * ========================= */

    useEffect(() => {
        const loadHistory =
            async () => {
                setLoading(true);
                setError("");

                try {
                    const [
                        upcomingResponse,
                        pastResponse,
                    ] =
                        await Promise.all([
                            fetch(
                                `${API_URL}/api/my-trips/upcoming`,
                                {
                                    headers:
                                        authHeaders,
                                },
                            ),

                            fetch(
                                `${API_URL}/api/my-trips/past`,
                                {
                                    headers:
                                        authHeaders,
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

                    const [
                        hydratedUpcoming,
                        hydratedPast,
                    ] =
                        await Promise.all([
                            Promise.all(
                                (
                                    upcomingData.member
                                    ?? upcomingData[
                                        "hydra:member"
                                    ]
                                    ?? []
                                ).map(
                                    hydrateTrip,
                                ),
                            ),

                            Promise.all(
                                (
                                    pastData.member
                                    ?? pastData[
                                        "hydra:member"
                                    ]
                                    ?? []
                                ).map(
                                    hydrateTrip,
                                ),
                            ),
                        ]);

                    setUpcomingTrips(
                        hydratedUpcoming.filter(
                            (
                                trip,
                            ): trip is TripCardTrip =>
                                trip !== null,
                        ),
                    );

                    setPastTrips(
                        hydratedPast.filter(
                            (
                                trip,
                            ): trip is TripCardTrip =>
                                trip !== null,
                        ),
                    );
                } catch (
                    caughtError
                ) {
                    setError(
                        caughtError
                            instanceof Error
                            ? caughtError.message
                            : "Une erreur est survenue.",
                    );
                } finally {
                    setLoading(false);
                }
            };

        void loadHistory();
    }, []);

    /*
     * MVP :
     * "Mes trajets" réutilise pour
     * l'instant les trajets à venir.
     */
    const trips =
        activeTab === "past"
            ? pastTrips
            : upcomingTrips;

    return (
        <div
            className="
                w-full
                bg-white
                pb-20
            "
        >
            {/* TABS */}
            <nav
                className="
                    grid
                    grid-cols-3
                    bg-zinc-800
                    text-[11px]
                    text-white
                "
            >
                <TabButton
                    active={
                        activeTab
                        === "upcoming"
                    }
                    onClick={() =>
                        setActiveTab(
                            "upcoming",
                        )
                    }
                >
                    à venir
                </TabButton>

                <TabButton
                    active={
                        activeTab
                        === "past"
                    }
                    bordered
                    onClick={() =>
                        setActiveTab(
                            "past",
                        )
                    }
                >
                    passé
                </TabButton>

                <TabButton
                    active={
                        activeTab
                        === "mine"
                    }
                    onClick={() =>
                        setActiveTab(
                            "mine",
                        )
                    }
                >
                    Mes trajets
                </TabButton>
            </nav>

            {/* CONTENT */}
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
                    && trips.length
                        === 0 && (
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
                    && trips.length
                        > 0 && (
                    <div
                        className="
                            space-y-3
                        "
                    >
                        {trips.map(
                            (trip) => (
                                <TripCard
                                    key={
                                        trip.id
                                    }
                                    trip={
                                        trip
                                    }
                                    onClick={
                                        (
                                            tripId,
                                        ) =>
                                            navigate(
                                                `/trips/${tripId}`,
                                            )
                                    }
                                />
                            ),
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

/* =========================
 * TAB
 * ========================= */

function TabButton({
    active,
    onClick,
    children,
    bordered = false,
}: {
    active: boolean;
    onClick: () => void;
    children: string;
    bordered?: boolean;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                h-10

                ${
                    bordered
                        ? "border-x border-zinc-700"
                        : ""
                }

                ${
                    active
                        ? "bg-sky-600"
                        : "bg-zinc-800"
                }
            `}
        >
            {children}
        </button>
    );
}