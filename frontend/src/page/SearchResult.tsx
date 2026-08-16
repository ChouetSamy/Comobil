import {
    CalendarDays,
    CarFront,
    Search,
    Venus,
} from "lucide-react";

import {
    useEffect,
    useState,
} from "react";

import type {
    FormEvent,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import TripCard from "../component/TripCard";

import type {
    Trip as TripCardTrip,
    TripPreference,
} from "../component/TripCard";

const API_URL =
    import.meta.env.VITE_API_URL
    ?? "http://localhost:8080";

/* =========================================================
 * TYPES
 * ========================================================= */

interface SearchForm {
    departureCommune: string;
    arrivalCommune: string;

    /*
     * Date et heure sont maintenant
     * réellement facultatives.
     */
    departureDate: string;
    departureTime: string;

    preferences: string[];

    lookingForDriver: boolean;
}

interface CurrentProfile {
    id: number;
}

interface PublicProfileResponse {
    user: {
        id: number;
        gender?: string | null;
    };
}

interface CityRef {
    id?: number;
    commune?: string;
}

interface AddressRef {
    id?: number;
    street?: string;

    city?:
        | CityRef
        | string;
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

    availableSeats?: number;

    pricePerPassenger?: number | null;

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

interface TripCollectionResponse {
    member?: ApiTrip[];

    "hydra:member"?: ApiTrip[];
}

interface PreferenceOption {
    description: string;
    label: string;
}

/* =========================================================
 * SEARCH OPTIONS
 * ========================================================= */

const PREFERENCES:
    PreferenceOption[] = [
        {
            description:
                "women_only",

            label:
                "Femmes uniquement",
        },

        {
            description:
                "quiet_trip",

            label:
                "Trajet calme",
        },

        {
            description:
                "music_allowed",

            label:
                "Musique autorisée",
        },

        {
            description:
                "non_smoking",

            label:
                "Non-fumeur",
        },
    ];

/*
 * IMPORTANT :
 *
 * La date n'est plus initialisée
 * automatiquement au jour courant.
 *
 * Donc :
 *
 * Toulouse
 *
 * signifie réellement :
 *
 * "tous les futurs trajets
 * partant de Toulouse".
 */
const initialForm:
    SearchForm = {
        departureCommune: "",

        arrivalCommune: "",

        departureDate: "",

        departureTime: "",

        preferences: [],

        lookingForDriver: false,
    };

/* =========================================================
 * PAGE
 * ========================================================= */

export default function SearchResult() {
    const navigate =
        useNavigate();

    const token =
        localStorage.getItem(
            "token",
        );

    const [
        form,
        setForm,
    ] =
        useState<SearchForm>(
            initialForm,
        );

    const [
        trips,
        setTrips,
    ] =
        useState<TripCardTrip[]>(
            [],
        );

    const [
        currentUserGender,
        setCurrentUserGender,
    ] =
        useState<string | null>(
            null,
        );

    const [
        isLoading,
        setIsLoading,
    ] =
        useState(false);

    const [
        hasSearched,
        setHasSearched,
    ] =
        useState(false);

    const [
        error,
        setError,
    ] =
        useState("");

    const authHeaders = {
        Authorization:
            `Bearer ${token}`,

        Accept:
            "application/ld+json",
    };

    /* =====================================================
     * CURRENT USER
     * ===================================================== */

    useEffect(() => {
        const loadCurrentUser =
            async () => {
                if (!token) {
                    return;
                }

                try {
                    const profileResponse =
                        await fetch(
                            `${API_URL}/profile`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    Accept:
                                        "application/json",
                                },
                            },
                        );

                    if (
                        !profileResponse.ok
                    ) {
                        return;
                    }

                    const currentProfile:
                        CurrentProfile =
                        await profileResponse.json();

                    const publicResponse =
                        await fetch(
                            `${API_URL}/api/public-profile/${currentProfile.id}`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    Accept:
                                        "application/json",
                                },
                            },
                        );

                    if (
                        !publicResponse.ok
                    ) {
                        return;
                    }

                    const publicProfile:
                        PublicProfileResponse =
                        await publicResponse.json();

                    setCurrentUserGender(
                        publicProfile
                            .user
                            .gender
                        ?? null,
                    );
                } catch {
                    /*
                     * Une erreur ici ne doit
                     * pas bloquer toute la recherche.
                     */
                    setCurrentUserGender(
                        null,
                    );
                }
            };

        void loadCurrentUser();
    }, [token]);

    /* =====================================================
     * FORM
     * ===================================================== */

    const updateField =
        <
            Key extends keyof SearchForm,
        >(
            key: Key,

            value:
                SearchForm[Key],
        ) => {
            setForm(
                (
                    current,
                ) => ({
                    ...current,

                    [key]:
                        value,
                }),
            );
        };

    const togglePreference =
        (
            description:
                string,
        ) => {
            /*
             * Sécurité front :
             *
             * un utilisateur non féminin
             * ne peut pas activer
             * women_only.
             */
            if (
                description
                    === "women_only"

                && !isFemale(
                    currentUserGender,
                )
            ) {
                return;
            }

            setForm(
                (
                    current,
                ) => ({
                    ...current,

                    preferences:
                        current
                            .preferences
                            .includes(
                                description,
                            )
                            ? current
                                .preferences
                                .filter(
                                    (
                                        item,
                                    ) =>
                                        item
                                            !== description,
                                )

                            : [
                                ...current
                                    .preferences,

                                description,
                            ],
                }),
            );
        };

    /* =====================================================
     * SEARCH PARAMS
     * ===================================================== */

    const buildSearchParams =
        () => {
            const params =
                new URLSearchParams();

            const departure =
                form
                    .departureCommune
                    .trim();

            const arrival =
                form
                    .arrivalCommune
                    .trim();

            /*
             * On n'envoie QUE les filtres
             * réellement renseignés.
             */

            if (departure) {
                params.set(
                    "departureCommune",
                    departure,
                );
            }

            if (arrival) {
                params.set(
                    "arrivalCommune",
                    arrival,
                );
            }

            if (
                form.departureDate
            ) {
                params.set(
                    "departureDate",
                    form.departureDate,
                );
            }

            /*
             * Une heure sans date n'est
             * actuellement pas exploitable
             * proprement par ton Provider.
             *
             * Elle n'est donc envoyée que
             * lorsqu'une date existe.
             */
            if (
                form.departureDate
                && form.departureTime
            ) {
                params.set(
                    "departureTime",
                    form.departureTime,
                );
            }

            form.preferences.forEach(
                (
                    preference,
                ) => {
                    params.append(
                        "preferences[]",
                        preference,
                    );
                },
            );

            if (
                form.lookingForDriver
            ) {
                params.set(
                    "tripCreatorRole",
                    "PASSENGER",
                );
            }

            return params;
        };

    /* =====================================================
     * GENERIC IRI FETCH
     * ===================================================== */

    const fetchResource =
        async <T,>(
            resource: string,
        ): Promise<T | null> => {
            const url =
                resource.startsWith(
                    "http",
                )
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

            if (
                !response.ok
            ) {
                return null;
            }

            return response.json();
        };

    /* =====================================================
     * ADDRESS
     * ===================================================== */

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
                address =
                    value;
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

    /* =====================================================
     * TRIP PREFERENCE
     * ===================================================== */

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

            if (
                !tripPreference
            ) {
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
                || !preference
                    .description
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

    /* =====================================================
     * HYDRATE TRIP FOR TRIP CARD
     * ===================================================== */

    const hydrateTrip =
        async (
            trip: ApiTrip,
        ): Promise<TripCardTrip | null> => {
            /*
             * Sécurité supplémentaire côté front :
             * aucun trajet déjà passé
             * ne sera affiché.
             */
            const departureDate =
                new Date(
                    trip.departureDatetime,
                );

            if (
                Number.isNaN(
                    departureDate
                        .getTime(),
                )

                || departureDate
                    .getTime()
                    < Date.now()
            ) {
                return null;
            }

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
                typeof departureAddress
                    .city
                    !== "object"

                || departureAddress
                    .city
                    === null
            ) {
                return null;
            }

            if (
                typeof arrivalAddress
                    .city
                    !== "object"

                || arrivalAddress
                    .city
                    === null
            ) {
                return null;
            }

            const preferences =
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

            const hydratedPreferences =
                preferences.filter(
                    (
                        preference,
                    ): preference is TripPreference =>
                        preference
                            !== null,
                );

            return {
                id:
                    trip.id,

                departureDatetime:
                    trip.departureDatetime,

                estimatedArrivalDatetime:
                    trip
                        .estimatedArrivalDatetime,

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

                tripPreferences:
                    hydratedPreferences,
            };
        };

    /* =====================================================
     * SUBMIT
     * ===================================================== */

    const handleSubmit =
        async (
            event:
                FormEvent<HTMLFormElement>,
        ) => {
            event.preventDefault();

            setIsLoading(true);

            setHasSearched(true);

            setError("");

            try {
                const params =
                    buildSearchParams();

                const query =
                    params.toString();

                const url =
                    query
                        ? `${API_URL}/api/trips/search?${query}`
                        : `${API_URL}/api/trips/search`;

                const response =
                    await fetch(
                        url,
                        {
                            headers: {
                                Accept:
                                    "application/ld+json",

                                ...(token && {
                                    Authorization:
                                        `Bearer ${token}`,
                                }),
                            },
                        },
                    );

                if (
                    !response.ok
                ) {
                    throw new Error(
                        "La recherche des trajets a échoué.",
                    );
                }

                const data:
                    TripCollectionResponse =
                    await response.json();

                const rawTrips =
                    data.member
                    ?? data[
                        "hydra:member"
                    ]
                    ?? [];

                const hydratedTrips =
                    await Promise.all(
                        rawTrips.map(
                            hydrateTrip,
                        ),
                    );

                /*
                 * Suppression :
                 * - relations invalides ;
                 * - trajets passés.
                 */
                const validTrips =
                    hydratedTrips.filter(
                        (
                            trip,
                        ): trip is TripCardTrip =>
                            trip !== null,
                    );

                /*
                 * Toujours du plus proche
                 * au plus lointain.
                 */
                validTrips.sort(
                    (
                        a,
                        b,
                    ) =>
                        new Date(
                            a.departureDatetime,
                        ).getTime()

                        - new Date(
                            b.departureDatetime,
                        ).getTime(),
                );

                setTrips(
                    validTrips,
                );
            } catch (
                caughtError
            ) {
                setTrips([]);

                setError(
                    caughtError
                        instanceof Error
                        ? caughtError.message
                        : "Une erreur inattendue est survenue.",
                );
            } finally {
                setIsLoading(false);
            }
        };

    /* =====================================================
     * VIEW
     * ===================================================== */

    return (
        <main
            className="
                mx-auto
                flex
                h-dvh
                w-full
                max-w-md
                flex-col
                overflow-hidden
                bg-white
            "
        >
            {/* =====================================
                SEARCH
            ====================================== */}

            <section
                aria-labelledby="search-title"
                className="
                    shrink-0
                    border-b
                    border-zinc-200
                    bg-white
                    px-4
                    py-4
                "
            >
                <div
                    className="
                        mb-3
                        flex
                        items-center
                        gap-2
                    "
                >
                    <Search
                        aria-hidden="true"
                        size={21}
                        className="
                            text-sky-600
                        "
                    />

                    <h1
                        id="search-title"
                        className="
                            text-lg
                            font-semibold
                            text-zinc-800
                        "
                    >
                        Rechercher un trajet
                    </h1>
                </div>

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="
                        space-y-3
                        rounded-xl
                        border
                        border-zinc-300
                        bg-white
                        p-3
                        shadow-sm
                    "
                >
                    {/* VILLES */}
                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-3
                        "
                    >
                        <label
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >
                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-zinc-700
                                "
                            >
                                Départ
                            </span>

                            <input
                                type="text"
                                value={
                                    form.departureCommune
                                }
                                placeholder="Ville de départ"
                                onChange={(
                                    event,
                                ) =>
                                    updateField(
                                        "departureCommune",
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                className="
                                    h-10
                                    rounded-lg
                                    border
                                    border-zinc-300
                                    px-3
                                    text-sm
                                    outline-none
                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-100
                                "
                            />
                        </label>

                        <label
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >
                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-zinc-700
                                "
                            >
                                Arrivée
                            </span>

                            <input
                                type="text"
                                value={
                                    form.arrivalCommune
                                }
                                placeholder="Ville d'arrivée"
                                onChange={(
                                    event,
                                ) =>
                                    updateField(
                                        "arrivalCommune",
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                className="
                                    h-10
                                    rounded-lg
                                    border
                                    border-zinc-300
                                    px-3
                                    text-sm
                                    outline-none
                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-100
                                "
                            />
                        </label>
                    </div>

                    {/* DATE + HEURE */}
                    <div
                        className="
                            grid
                            grid-cols-2
                            gap-3
                        "
                    >
                        <label
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >
                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-zinc-700
                                "
                            >
                                Date
                                <span
                                    className="
                                        ml-1
                                        font-normal
                                        text-zinc-400
                                    "
                                >
                                    optionnelle
                                </span>
                            </span>

                            <span
                                className="
                                    relative
                                "
                            >
                                <CalendarDays
                                    aria-hidden="true"
                                    size={16}
                                    className="
                                        pointer-events-none
                                        absolute
                                        right-3
                                        top-1/2
                                        -translate-y-1/2
                                        text-zinc-500
                                    "
                                />

                                <input
                                    type="date"
                                    value={
                                        form.departureDate
                                    }
                                    onChange={(
                                        event,
                                    ) =>
                                        updateField(
                                            "departureDate",
                                            event
                                                .target
                                                .value,
                                        )
                                    }
                                    className="
                                        h-10
                                        w-full
                                        rounded-lg
                                        border
                                        border-zinc-300
                                        px-3
                                        pr-9
                                        text-sm
                                        outline-none
                                        focus:border-sky-500
                                        focus:ring-2
                                        focus:ring-sky-100
                                    "
                                />
                            </span>
                        </label>

                        <label
                            className="
                                flex
                                flex-col
                                gap-1
                            "
                        >
                            <span
                                className="
                                    text-xs
                                    font-medium
                                    text-zinc-700
                                "
                            >
                                Heure
                                <span
                                    className="
                                        ml-1
                                        font-normal
                                        text-zinc-400
                                    "
                                >
                                    optionnelle
                                </span>
                            </span>

                            <input
                                type="time"
                                value={
                                    form.departureTime
                                }
                                disabled={
                                    !form.departureDate
                                }
                                onChange={(
                                    event,
                                ) =>
                                    updateField(
                                        "departureTime",
                                        event
                                            .target
                                            .value,
                                    )
                                }
                                className="
                                    h-10
                                    rounded-lg
                                    border
                                    border-zinc-300
                                    px-3
                                    text-sm
                                    outline-none
                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-100
                                    disabled:bg-zinc-100
                                    disabled:text-zinc-400
                                "
                            />
                        </label>
                    </div>

                    {/* PREFERENCES */}
                    <fieldset
                        className="
                            space-y-2
                        "
                    >
                        <legend
                            className="
                                text-xs
                                font-medium
                                text-zinc-700
                            "
                        >
                            Préférences
                        </legend>

                        <div
                            className="
                                grid
                                grid-cols-2
                                gap-2
                            "
                        >
                            {PREFERENCES.map(
                                (
                                    preference,
                                ) => {
                                    const womenOnlyDisabled =
                                        preference
                                            .description
                                            === "women_only"

                                        && !isFemale(
                                            currentUserGender,
                                        );

                                    return (
                                        <div
                                            key={
                                                preference
                                                    .description
                                            }
                                            className={`
                                                flex
                                                min-w-0
                                                items-center
                                                justify-between
                                                gap-2
                                                overflow-hidden
                                                rounded-lg
                                                bg-zinc-50
                                                px-3
                                                py-2
                                                text-xs
                                                text-zinc-700

                                                ${
                                                    womenOnlyDisabled
                                                        ? "cursor-not-allowed opacity-40"
                                                        : ""
                                                }
                                            `}
                                        >
                                            <span
                                                className="
                                                    flex
                                                    min-w-0
                                                    items-center
                                                    gap-1
                                                "
                                            >
                                                {preference
                                                    .description
                                                    === "women_only"
                                                    && (
                                                        <Venus
                                                            aria-hidden="true"
                                                            size={16}
                                                            className="
                                                                shrink-0
                                                                text-pink-600
                                                            "
                                                        />
                                                    )}

                                                <span
                                                    className="
                                                        truncate
                                                    "
                                                >
                                                    {
                                                        preference
                                                            .label
                                                    }
                                                </span>
                                            </span>

                                            <Toggle
                                                checked={
                                                    form
                                                        .preferences
                                                        .includes(
                                                            preference
                                                                .description,
                                                        )
                                                }
                                                disabled={
                                                    womenOnlyDisabled
                                                }
                                                label={
                                                    preference
                                                        .label
                                                }
                                                onChange={() =>
                                                    togglePreference(
                                                        preference
                                                            .description,
                                                    )
                                                }
                                            />
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </fieldset>

                    {/* RECHERCHE CONDUCTEUR */}
                    <div
                        className="
                            flex
                            items-center
                            justify-between
                            gap-3
                            overflow-hidden
                            rounded-lg
                            bg-zinc-50
                            px-3
                            py-2
                            text-xs
                            text-zinc-700
                        "
                    >
                        <span
                            className="
                                flex
                                min-w-0
                                items-center
                                gap-2
                            "
                        >
                            <CarFront
                                aria-hidden="true"
                                size={18}
                                className="
                                    shrink-0
                                "
                            />

                            <span>
                                Recherche un conducteur
                            </span>
                        </span>

                        <Toggle
                            checked={
                                form.lookingForDriver
                            }
                            label="Trajets recherchant un conducteur"
                            onChange={() =>
                                updateField(
                                    "lookingForDriver",
                                    !form
                                        .lookingForDriver,
                                )
                            }
                        />
                    </div>

                    {/* SUBMIT */}
                    <button
                        type="submit"
                        disabled={
                            isLoading
                        }
                        className="
                            flex
                            h-10
                            w-full
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            bg-sky-600
                            text-sm
                            font-semibold
                            text-white
                            transition
                            hover:bg-sky-700
                            disabled:cursor-wait
                            disabled:opacity-60
                        "
                    >
                        <Search
                            aria-hidden="true"
                            size={17}
                        />

                        {isLoading
                            ? "Recherche en cours…"
                            : "Rechercher"}
                    </button>
                </form>
            </section>

            {/* =====================================
                RESULTS
            ====================================== */}

            <section
                aria-labelledby="results-title"
                className="
                    min-h-0
                    flex-1
                    overflow-y-auto
                    bg-zinc-100
                    px-3
                    py-3
                "
            >
                <h2
                    id="results-title"
                    className="
                        mb-3
                        text-sm
                        font-semibold
                        text-zinc-800
                    "
                >
                    Trajets disponibles
                </h2>

                {error && (
                    <div
                        role="alert"
                        className="
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            p-3
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}

                {!error
                    && trips.length
                        > 0 && (
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            pb-6
                        "
                    >
                        {trips.map(
                            (
                                trip,
                            ) => (
                                <TripCard
                                    key={
                                        trip.id
                                    }
                                    trip={
                                        trip
                                    }
                                    onClick={(
                                        selectedTripId,
                                    ) =>
                                        navigate(
                                            `/trips/${selectedTripId}`,
                                        )
                                    }
                                />
                            ),
                        )}
                    </div>
                )}

                {!error
                    && hasSearched
                    && !isLoading
                    && trips.length
                        === 0 && (
                    <div
                        className="
                            flex
                            min-h-52
                            flex-col
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-dashed
                            border-zinc-300
                            bg-white
                            px-6
                            text-center
                        "
                    >
                        <Search
                            aria-hidden="true"
                            size={34}
                            className="
                                mb-3
                                text-zinc-400
                            "
                        />

                        <h3
                            className="
                                font-semibold
                                text-zinc-800
                            "
                        >
                            Aucun trajet trouvé
                        </h3>

                        <p
                            className="
                                mt-1
                                text-sm
                                text-zinc-500
                            "
                        >
                            Créez votre trajet pour trouver
                            un conducteur ou des passagers.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/trips/create",
                                )
                            }
                            className="
                                mt-4
                                rounded-lg
                                bg-sky-600
                                px-4
                                py-2
                                text-sm
                                font-semibold
                                text-white
                            "
                        >
                            Créer un trajet
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}

/* =========================================================
 * TOGGLE
 * ========================================================= */

interface ToggleProps {
    checked: boolean;

    label: string;

    onChange: () => void;

    disabled?: boolean;
}

function Toggle({
    checked,
    label,
    onChange,
    disabled = false,
}: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={
                checked
            }
            aria-label={
                label
            }
            disabled={
                disabled
            }
            onClick={
                onChange
            }
            className={`
                relative
                h-6
                w-11
                shrink-0
                overflow-hidden
                rounded-full
                transition-colors

                ${
                    checked
                        ? "bg-sky-600"
                        : "bg-zinc-700"
                }

                ${
                    disabled
                        ? "cursor-not-allowed opacity-50"
                        : ""
                }
            `}
        >
            <span
                aria-hidden="true"
                className={`
                    absolute
                    left-1
                    top-1
                    h-4
                    w-4
                    rounded-full
                    bg-white
                    shadow
                    transition-transform
                    duration-200

                    ${
                        checked
                            ? "translate-x-5"
                            : "translate-x-0"
                    }
                `}
            />
        </button>
    );
}

/* =========================================================
 * HELPERS
 * ========================================================= */

function isFemale(
    gender:
        string
        | null,
): boolean {
    if (!gender) {
        return false;
    }

    const normalized =
        gender
            .trim()
            .toUpperCase();

    return [
        "FEMALE",
        "FEMME",
        "WOMAN",
    ].includes(
        normalized,
    );
}