import {
    CarFront,
    ChevronRight,
    CircleUserRound,
    Users,
    Venus,
} from "lucide-react";

export interface Preference {
    id: number;
    description: string;
}

export interface TripPreference {
    id: number;
    isActive: boolean;
    preference: Preference;
}

export type TripCreatorRole = "DRIVER" | "PASSENGER";

export interface Trip {
    id: number;
    departureDatetime: string;
    estimatedArrivalDatetime: string;
    totalPrice: number;
    availableSeats: number;
    tripCreatorRole: TripCreatorRole;
    pricePerPassenger: number | null;

    departureAddress: {
        street: string;
        city: {
            commune: string;
        };
    };

    arrivalAddress: {
        street: string;
        city: {
            commune: string;
        };
    };

    tripPreferences: TripPreference[];
}

interface TripCardProps {
    trip: Trip;
    onClick?: (tripId: number) => void;
    showLink?: boolean;
}

const hasActivePreference = (
    tripPreferences: TripPreference[],
    description: string,
): boolean =>
    tripPreferences.some(
        (tripPreference) =>
            tripPreference.isActive
            && tripPreference.preference.description === description,
    );

const formatTime = (date: string): string =>
    new Intl.DateTimeFormat("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(date));

const formatPrice = (price: number): string =>
    new Intl.NumberFormat("fr-FR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
    }).format(price);

export default function TripCard({
    trip,
    onClick,
    showLink = true,
}: TripCardProps) {
    const womenOnly = hasActivePreference(
        trip.tripPreferences,
        "women_only",
    );

    const isLookingForDriver =
        trip.tripCreatorRole === "PASSENGER";

    return (
        <article
            className="
                overflow-hidden
                rounded-xl
                border
                border-zinc-200
                bg-white
                shadow-sm
                transition-shadow
                hover:shadow-md
            "
        >
            {showLink && (
                <button
                    type="button"
                    onClick={() => onClick?.(trip.id)}
                    className="
            flex
            w-full
            items-center
            justify-between
            border-b
            border-zinc-100
            px-4
            py-2
            text-left
            text-xs
            font-medium
            text-zinc-600
            transition-colors
            hover:bg-zinc-50
        "
                >
                    <span>Voir le trajet</span>

                    <ChevronRight
                        aria-hidden="true"
                        size={16}
                    />
                </button>
            )}

            <div className="grid grid-cols-2 gap-5 px-5 pt-4">
                <section>
                    <h2 className="text-2xl font-bold text-zinc-700">
                        {trip.departureAddress.city.commune}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        {trip.departureAddress.street}
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold text-zinc-700">
                        {trip.arrivalAddress.city.commune}
                    </h2>

                    <p className="mt-1 text-sm text-zinc-500">
                        {trip.arrivalAddress.street}
                    </p>
                </section>
            </div>

            <div className="grid grid-cols-2 gap-5 px-5 py-5">
                <section>
                    <p className="text-xs text-zinc-500">
                        Départ
                    </p>

                    <p className="mt-1 text-4xl font-light text-zinc-700">
                        {formatTime(trip.departureDatetime)}
                    </p>
                </section>

                <section>
                    <p className="text-xs text-zinc-500">
                        Arrivée estimée
                    </p>

                    <p className="mt-1 text-4xl font-light text-zinc-700">
                        {formatTime(
                            trip.estimatedArrivalDatetime,
                        )}
                    </p>
                </section>
            </div>

            <div className="bg-sky-600 px-5 py-4 text-white">
                <div className="grid grid-cols-3 items-center gap-3">
                    <section>
                        <p className="text-[10px] uppercase opacity-80">
                            Actuellement
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                            <span className="text-3xl font-bold">
                                {formatPrice(
                                    trip.pricePerPassenger ?? 0,
                                )}
                            </span>

                            <CircleUserRound
                                aria-hidden="true"
                                size={18}
                            />
                        </div>
                    </section>

                    <section className="text-center">
                        <Users
                            aria-hidden="true"
                            className="mx-auto"
                            size={24}
                        />

                        <p className="mt-1 font-semibold">
                            {trip.availableSeats} place
                            {trip.availableSeats > 1 ? "s" : ""}
                        </p>
                    </section>

                    <section className="text-right">
                        <p className="text-[10px] uppercase opacity-80">
                            Coût du trajet
                        </p>

                        <p className="mt-1 text-4xl font-bold">
                            {formatPrice(trip.totalPrice)}
                        </p>
                    </section>
                </div>
            </div>

            {(womenOnly || isLookingForDriver) && (
                <div className="flex flex-wrap gap-2 px-4 py-3">
                    {womenOnly && (
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-pink-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-pink-700
                            "
                        >
                            <Venus
                                aria-hidden="true"
                                size={14}
                            />

                            Femmes uniquement
                        </span>
                    )}

                    {isLookingForDriver && (
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1.5
                                rounded-full
                                bg-sky-100
                                px-3
                                py-1
                                text-xs
                                font-medium
                                text-sky-700
                            "
                        >
                            <CarFront
                                aria-hidden="true"
                                size={14}
                            />

                            Recherche un conducteur
                        </span>
                    )}
                </div>
            )}
        </article>
    );
}