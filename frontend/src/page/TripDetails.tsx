import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import TripCard from "../component/TripCard";
import type {
    Trip as TripCardTrip,
    TripPreference as TripCardPreference,
} from "../component/TripCard";

import UserCard from "../component/user/UserCard";

import VehicleCard from "../component/vehicle/VehicleCard";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface UserInfoRef {
    pictureUrl?: string | null;
    averageRating?: number | null;
}

interface UserRef {
    "@id"?: string;
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
    userInfo?: UserInfoRef | string | null;
}

interface PublicProfileResponse {
    user: {
        id: number;
        firstName: string;
        lastName: string;
        phone?: string | null;
        gender?: string | null;
    };

    userInfo: {
        id: number;
        pictureUrl: string | null;
        bio: string | null;
        acceptCall: boolean;
        averageRating: number | null;
    } | null;
}

interface CityRef {
    "@id"?: string;
    id?: number;
    commune?: string;
}

interface AddressRef {
    "@id"?: string;
    id?: number;
    street?: string;
    city?: CityRef | string;
}

interface VehicleRef {
    "@id"?: string;
    id?: number;
    pictureUrl?: string | null;
    ac?: boolean;
    hasAc?: boolean;
    consumptionLiterPer100km?: number | null;
    seat?: number;
    vehicleState?: string;
    description?: string | null;
}

interface TravelerRef {
    "@id"?: string;
    id: number;
    user?: UserRef | string;
    travelerRole?: string;
    travelerStatus?: string;
}

interface PreferenceRef {
    "@id"?: string;
    id?: number;
    description?: string;
}

interface TripPreferenceRef {
    "@id"?: string;
    id: number;

    isActive?: boolean;
    active?: boolean;

    preference?: PreferenceRef | string;
}

interface Trip {
    "@id"?: string;
    id: number;

    departureDatetime: string;
    estimatedArrivalDatetime: string;

    totalPrice?: number;
    pricePerPassenger?: number | null;
    availableSeats?: number;

    tripCreatorRole?: string;
    tripStatus?: string;

    creator?: UserRef | string;
    vehicle?: VehicleRef | string | null;

    departureAddress?: AddressRef | string;
    arrivalAddress?: AddressRef | string;

    travelers?: Array<TravelerRef | string>;

    tripPreferences?: Array<
        TripPreferenceRef | string
    >;
}

interface Profile {
    id: number;
}

export default function TripDetails() {
    const { tripId } =
        useParams();

    const navigate =
        useNavigate();

    const token =
        localStorage.getItem("token");

    const [trip, setTrip] =
        useState<Trip | null>(null);

    const [creator, setCreator] =
        useState<UserRef | null>(null);

    const [vehicle, setVehicle] =
        useState<VehicleRef | null>(null);

    const [
        departureAddress,
        setDepartureAddress,
    ] =
        useState<AddressRef | null>(null);

    const [
        arrivalAddress,
        setArrivalAddress,
    ] =
        useState<AddressRef | null>(null);

    const [
        travelers,
        setTravelers,
    ] =
        useState<TravelerRef[]>([]);

    const [
        tripPreferences,
        setTripPreferences,
    ] =
        useState<TripCardPreference[]>([]);

    const [
        currentUserId,
        setCurrentUserId,
    ] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [
        actionLoading,
        setActionLoading,
    ] =
        useState(false);

    const [error, setError] =
        useState("");

    const [message, setMessage] =
        useState("");

    const authHeaders = {
        Authorization:
            `Bearer ${token}`,
        Accept:
            "application/ld+json",
    };

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

    const loadUser =
        async (
            value?: UserRef | string,
        ): Promise<UserRef | null> => {
            if (!value) {
                return null;
            }

            let user:
                UserRef | null;

            if (
                typeof value
                === "string"
            ) {
                user =
                    await fetchResource<UserRef>(
                        value,
                    );
            } else {
                user = value;
            }

            if (!user?.id) {
                return user;
            }

            const response =
                await fetch(
                    `${API_URL}/api/public-profile/${user.id}`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                            Accept:
                                "application/json",
                        },
                    },
                );

            if (!response.ok) {
                return user;
            }

            const publicProfile:
                PublicProfileResponse =
                await response.json();

            return {
                ...user,

                id:
                    publicProfile.user.id,

                firstName:
                    publicProfile
                        .user
                        .firstName,

                lastName:
                    publicProfile
                        .user
                        .lastName,

                userInfo:
                    publicProfile.userInfo
                        ? {
                            pictureUrl:
                                publicProfile
                                    .userInfo
                                    .pictureUrl,

                            averageRating:
                                publicProfile
                                    .userInfo
                                    .averageRating,
                        }
                        : null,
            };
        };

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

    const loadVehicle =
        async (
            value?:
                | VehicleRef
                | string
                | null,
        ): Promise<VehicleRef | null> => {
            if (!value) {
                return null;
            }

            if (
                typeof value
                === "string"
            ) {
                return fetchResource<VehicleRef>(
                    value,
                );
            }

            return value;
        };

    const loadTraveler =
        async (
            value:
                | TravelerRef
                | string,
        ): Promise<TravelerRef | null> => {
            let traveler:
                TravelerRef | null;

            if (
                typeof value
                === "string"
            ) {
                traveler =
                    await fetchResource<TravelerRef>(
                        value,
                    );
            } else {
                traveler = value;
            }

            if (!traveler) {
                return null;
            }

            const user =
                await loadUser(
                    traveler.user,
                );

            return {
                ...traveler,

                user:
                    user
                    ?? traveler.user,
            };
        };

    const loadTripPreference =
        async (
            value:
                | TripPreferenceRef
                | string,
        ): Promise<TripCardPreference | null> => {
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
                tripPreference.preference
            ) {
                preference =
                    tripPreference.preference;
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
                    tripPreference.isActive
                    ?? tripPreference.active
                    ?? true,

                preference: {
                    id:
                        preference.id,

                    description:
                        preference.description,
                },
            };
        };

    const loadTrip =
        async () => {
            if (!tripId) {
                setError(
                    "Trajet invalide.",
                );

                setLoading(false);

                return;
            }

            setLoading(true);
            setError("");

            try {
                const [
                    tripResponse,
                    profileResponse,
                ] =
                    await Promise.all([
                        fetch(
                            `${API_URL}/api/trips/${tripId}`,
                            {
                                headers:
                                    authHeaders,
                            },
                        ),

                        fetch(
                            `${API_URL}/profile`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    Accept:
                                        "application/json",
                                },
                            },
                        ),
                    ]);

                if (
                    !tripResponse.ok
                ) {
                    throw new Error(
                        "Impossible de charger le trajet.",
                    );
                }

                if (
                    !profileResponse.ok
                ) {
                    throw new Error(
                        "Impossible de charger votre profil.",
                    );
                }

                const tripData:
                    Trip =
                    await tripResponse.json();

                const profileData:
                    Profile =
                    await profileResponse.json();

                setTrip(
                    tripData,
                );

                setCurrentUserId(
                    profileData.id,
                );

                const [
                    loadedCreator,
                    loadedDeparture,
                    loadedArrival,
                    loadedVehicle,
                ] =
                    await Promise.all([
                        loadUser(
                            tripData.creator,
                        ),

                        loadAddress(
                            tripData.departureAddress,
                        ),

                        loadAddress(
                            tripData.arrivalAddress,
                        ),

                        loadVehicle(
                            tripData.vehicle,
                        ),
                    ]);

                setCreator(
                    loadedCreator,
                );

                setDepartureAddress(
                    loadedDeparture,
                );

                setArrivalAddress(
                    loadedArrival,
                );

                setVehicle(
                    loadedVehicle,
                );

                const travelerResults =
                    await Promise.all(
                        (
                            tripData.travelers
                            ?? []
                        ).map(
                            (
                                traveler,
                            ) =>
                                loadTraveler(
                                    traveler,
                                ),
                        ),
                    );

                setTravelers(
                    travelerResults.filter(
                        (
                            traveler,
                        ): traveler is TravelerRef =>
                            traveler !== null
                            && traveler
                                .travelerStatus
                            !== "EXCLUDED",
                    ),
                );

                const preferenceResults =
                    await Promise.all(
                        (
                            tripData.tripPreferences
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

                setTripPreferences(
                    preferenceResults.filter(
                        (
                            preference,
                        ): preference is TripCardPreference =>
                            preference !== null,
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

    useEffect(() => {
        void loadTrip();
    }, [tripId]);

    if (loading) {
        return (
            <p
                className="
                    py-10
                    text-center
                    text-sm
                    text-zinc-500
                "
            >
                Chargement du trajet...
            </p>
        );
    }

    if (
        error
        || !trip
    ) {
        return (
            <p
                className="
                    m-4
                    rounded-md
                    bg-red-50
                    p-3
                    text-sm
                    text-red-600
                "
            >
                {error
                    || "Trajet introuvable."}
            </p>
        );
    }

    const creatorId =
        creator?.id
        ?? extractId(
            trip.creator,
        );

    const isCreator =
        currentUserId !== null
        && creatorId
        === currentUserId;

    const currentUserIsTraveler =
        travelers.some(
            (
                traveler,
            ) => {
                const userId =
                    extractId(
                        traveler.user,
                    );

                return (
                    userId
                    === currentUserId
                    && traveler
                        .travelerStatus
                    !== "EXCLUDED"
                );
            },
        );

    const tripCardData =
        buildTripCardData(
            trip,
            departureAddress,
            arrivalAddress,
            tripPreferences,
        );

    const openTripMessages =
        () => {
            navigate(
                `/trips/${trip.id}/messages`,
            );
        };

    const openPublicProfile =
        (
            userId?:
                number
                | null,
        ) => {
            if (!userId) {
                return;
            }

            navigate(
                `/profile/${userId}?tripId=${trip.id}`,
            );
        };

    const openPrivateMessage =
        (
            userId?:
                number
                | null,
        ) => {
            if (!userId) {
                return;
            }

            navigate(
                `/trips/${trip.id}/messages/${userId}`,
            );
        };

    const reportUser =
        (
            userId?:
                number
                | null,
        ) => {
            if (!userId) {
                return;
            }

            window.alert(
                `Signalement utilisateur #${userId} non encore branché.`,
            );
        };

    const blacklistUser =
        (
            userId?:
                number
                | null,
        ) => {
            if (!userId) {
                return;
            }

            window.alert(
                `Blacklist utilisateur #${userId} non encore branchée.`,
            );
        };

    const callUser =
        () => {
            window.alert(
                "Le numéro de téléphone est disponible depuis le profil.",
            );
        };

    const joinTrip =
        async () => {
            setMessage("");
            setError("");

            setActionLoading(
                true,
            );

            try {
                const response =
                    await fetch(
                        `${API_URL}/api/travelers`,
                        {
                            method:
                                "POST",

                            headers: {
                                ...authHeaders,

                                "Content-Type":
                                    "application/ld+json",
                            },

                            body:
                                JSON.stringify({
                                    trip:
                                        `/api/trips/${trip.id}`,

                                    travelerRole:
                                        "PASSENGER",
                                }),
                        },
                    );

                if (!response.ok) {
                    const data =
                        await response.json();

                    throw new Error(
                        data.detail
                        ?? data.error
                        ?? "Impossible de rejoindre le trajet.",
                    );
                }

                setMessage(
                    "Vous avez rejoint le trajet.",
                );

                await loadTrip();
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
                setActionLoading(
                    false,
                );
            }
        };

    const cancelTrip =
        async () => {
            setError("");
            setMessage("");

            setActionLoading(
                true,
            );

            try {
                const response =
                    await fetch(
                        `${API_URL}/api/trips/${trip.id}`,
                        {
                            method:
                                "DELETE",

                            headers:
                                authHeaders,
                        },
                    );

                if (!response.ok) {
                    const data =
                        await response.json();

                    throw new Error(
                        data.detail
                        ?? data.error
                        ?? "Impossible d'annuler le trajet.",
                    );
                }

                navigate(
                    "/trips/history",
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
                setActionLoading(
                    false,
                );
            }
        };

    return (
        <div
            className="
                w-full
                bg-white
                pb-24
            "
        >
            <main
                className="
                    mx-auto
                    w-full
                    max-w-[520px]
                    px-4
                    py-4
                "
            >
                {/* CREATEUR */}
                <section>
                    <UserCard
                        userId={
                            creatorId
                            ?? 0
                        }
                        name={
                            getUserName(
                                creator,
                            )
                        }
                        pictureUrl={
                            getPictureUrl(
                                creator,
                            )
                        }
                        rating={
                            getRating(
                                creator,
                            )
                        }

                        tripRole={
                            trip.tripCreatorRole
                                === "DRIVER"
                                ? "DRIVER"
                                : "PASSENGER"
                        }

                        isCurrentUser={
                            creatorId
                            === currentUserId
                        }

                        onPublicProfile={() =>
                            openPublicProfile(
                                creatorId,
                            )
                        }

                        /*
                         * Bulle principale de TripDetails
                         * => TripMessage
                         */
                        onMessage={
                            openTripMessages
                        }

                        onContact={
                            openTripMessages
                        }

                        /*
                         * Toujours disponible
                         * dans le menu ⋮.
                         */
                        onPrivateMessage={() =>
                            openPrivateMessage(
                                creatorId,
                            )
                        }

                        onReport={() =>
                            reportUser(
                                creatorId,
                            )
                        }

                        onBlacklist={() =>
                            blacklistUser(
                                creatorId,
                            )
                        }

                        onCall={
                            callUser
                        }

                        size="large"
                    />

                    <p
                        className="
                            mt-1
                            text-xs
                            text-zinc-600
                        "
                    >
                        {trip.tripCreatorRole
                            === "PASSENGER"
                            ? "Le créateur du trajet"
                            : "Le conducteur du trajet"}
                    </p>

                    <div
                        className="
                            mt-3
                            flex
                            gap-2
                            overflow-x-auto
                        "
                    >
                        <ActionSmallButton
                            label="Contacter"
                            onClick={
                                openTripMessages
                            }
                        />

                        <ActionSmallButton
                            label="Invite à un trajet"
                            onClick={
                                openTripMessages
                            }
                        />

                        <ActionSmallButton
                            label="Invite à..."
                            onClick={
                                openTripMessages
                            }
                        />
                    </div>
                </section>

                {/* TRAJET */}
                {tripCardData && (
                    <div
                        className="
                            mt-5
                        "
                    >
                        <TripCard
                            trip={
                                tripCardData
                            }
                            showLink={
                                false
                            }
                        />
                    </div>
                )}

                {/* ACTIONS */}
                <div
                    className="
                        mt-2
                        grid
                        grid-cols-2
                        gap-2
                    "
                >
                    {!isCreator
                        && !currentUserIsTraveler && (
                            <button
                                type="button"
                                disabled={
                                    actionLoading
                                }
                                onClick={() =>
                                    void joinTrip()
                                }
                                className="
                                h-10
                                rounded-md
                                bg-sky-600
                                text-xs
                                font-medium
                                text-white
                                disabled:opacity-50
                            "
                            >
                                REJOINDRE LE TRAJET
                            </button>
                        )}

                    {(isCreator
                        || currentUserIsTraveler) && (
                            <button
                                type="button"
                                onClick={
                                    openTripMessages
                                }
                                className="
                                h-10
                                rounded-md
                                bg-sky-600
                                text-xs
                                font-medium
                                text-white
                            "
                            >
                                MESSAGERIE
                            </button>
                        )}

                    {isCreator && (
                        <button
                            type="button"
                            disabled={
                                actionLoading
                            }
                            onClick={() =>
                                void cancelTrip()
                            }
                            className="
                                h-10
                                rounded-md
                                bg-red-600
                                text-xs
                                font-medium
                                text-white
                                disabled:opacity-50
                            "
                        >
                            ANNULER LE TRAJET
                        </button>
                    )}
                </div>

                {message && (
                    <p
                        className="
                            mt-3
                            rounded
                            bg-green-50
                            p-2
                            text-sm
                            text-green-700
                        "
                    >
                        {message}
                    </p>
                )}

                {error && (
                    <p
                        className="
                            mt-3
                            rounded
                            bg-red-50
                            p-2
                            text-sm
                            text-red-600
                        "
                    >
                        {error}
                    </p>
                )}

                {/* PASSAGERS */}
                <section
                    className="
                        mt-6
                    "
                >
                    <h2
                        className="
                            mb-3
                            text-sm
                            font-semibold
                            text-zinc-700
                        "
                    >
                        Les passagers
                    </h2>

                    {travelers.length
                        === 0 ? (
                        <p
                            className="
                                text-sm
                                text-zinc-400
                            "
                        >
                            Aucun passager.
                        </p>
                    ) : (
                        <div
                            className="
                                space-y-3
                            "
                        >
                            {travelers.map(
                                (
                                    traveler,
                                ) => {
                                    const travelerUser =
                                        typeof traveler.user
                                            === "object"
                                            ? traveler.user
                                            : null;

                                    const travelerUserId =
                                        extractId(
                                            traveler.user,
                                        );

                                    return (
                                        <UserCard
                                            key={
                                                traveler.id
                                            }
                                            userId={
                                                travelerUserId
                                                ?? 0
                                            }
                                            name={
                                                getUserName(
                                                    travelerUser,
                                                )
                                            }
                                            pictureUrl={
                                                getPictureUrl(
                                                    travelerUser,
                                                )
                                            }
                                            rating={
                                                getRating(
                                                    travelerUser,
                                                )
                                            }

                                            tripRole={
                                                traveler.travelerRole
                                                    === "DRIVER"
                                                    ? "DRIVER"
                                                    : "PASSENGER"
                                            }

                                            isCurrentUser={
                                                travelerUserId
                                                === currentUserId
                                            }

                                            onPublicProfile={() =>
                                                openPublicProfile(
                                                    travelerUserId,
                                                )
                                            }

                                            onMessage={
                                                openTripMessages
                                            }

                                            onContact={
                                                openTripMessages
                                            }

                                            onPrivateMessage={() =>
                                                openPrivateMessage(
                                                    travelerUserId,
                                                )
                                            }

                                            onReport={() =>
                                                reportUser(
                                                    travelerUserId,
                                                )
                                            }

                                            onBlacklist={() =>
                                                blacklistUser(
                                                    travelerUserId,
                                                )
                                            }

                                            onCall={
                                                callUser
                                            }

                                            size="small"
                                        />
                                    );
                                },
                            )}
                        </div>
                    )}
                </section>

                {/* VEHICULE */}
                {vehicle && (
                    <section
                        className="
                            mt-7
                        "
                    >
                        <h2
                            className="
                                mb-2
                                text-sm
                                text-zinc-700
                            "
                        >
                            Le véhicule
                        </h2>

                        <VehicleCard
                            vehicle={{
                                id:
                                    vehicle.id
                                    ?? 0,

                                pictureUrl:
                                    vehicle.pictureUrl,

                                seat:
                                    vehicle.seat,

                                hasAc:
                                    vehicle.hasAc
                                    ?? vehicle.ac
                                    ?? false,

                                consumptionLiterPer100km:
                                    vehicle
                                        .consumptionLiterPer100km,

                                vehicleState:
                                    vehicle.vehicleState
                                    ?? null,

                                description:
                                    vehicle.description
                                    ?? null,
                            }}
                        />
                    </section>
                )}
            </main>
        </div>
    );
}

function ActionSmallButton({
    label,
    onClick,
}: {
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={
                onClick
            }
            className="
                flex
                shrink-0
                items-center
                gap-1
                rounded
                bg-sky-600
                px-3
                py-1.5
                text-xs
                text-white
            "
        >
            <MessageCircle
                size={13}
                fill="currentColor"
            />

            {label}
        </button>
    );
}

function buildTripCardData(
    trip: Trip,
    departureAddress:
        AddressRef | null,
    arrivalAddress:
        AddressRef | null,
    tripPreferences:
        TripCardPreference[],
): TripCardTrip | null {
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
                departureAddress.street
                ?? "",

            city: {
                commune:
                    departureAddress
                        .city
                        .commune
                    ?? "",
            },
        },

        arrivalAddress: {
            street:
                arrivalAddress.street
                ?? "",

            city: {
                commune:
                    arrivalAddress
                        .city
                        .commune
                    ?? "",
            },
        },

        tripPreferences,
    };
}

function extractId(
    value?:
        | { id?: number }
        | string
        | null,
): number | null {
    if (!value) {
        return null;
    }

    if (
        typeof value
        === "object"
    ) {
        return value.id
            ?? null;
    }

    const parts =
        value.split("/");

    const id =
        Number(
            parts[
            parts.length - 1
            ],
        );

    return Number.isNaN(id)
        ? null
        : id;
}

function getUserName(
    user?: UserRef | null,
): string {
    if (!user) {
        return "Utilisateur";
    }

    const name = [
        user.firstName,
        user.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        name
        || user.email
        || "Utilisateur"
    );
}

function getPictureUrl(
    user?: UserRef | null,
): string {
    if (
        !user
        || typeof user.userInfo
        !== "object"
        || user.userInfo
        === null
    ) {
        return "";
    }

    return resolveImageUrl(
        user.userInfo.pictureUrl,
    );
}

function getRating(
    user?: UserRef | null,
): number {
    if (
        !user
        || typeof user.userInfo
        !== "object"
        || user.userInfo
        === null
    ) {
        return 0;
    }

    return (
        user.userInfo.averageRating
        ?? 0
    );
}

function resolveImageUrl(
    url?:
        string
        | null,
): string {
    if (!url) {
        return "";
    }

    if (
        url.startsWith("http://")
        || url.startsWith("https://")
        || url.startsWith("blob:")
        || url.startsWith("data:")
    ) {
        return url;
    }

    return `${API_URL}${url}`;
}