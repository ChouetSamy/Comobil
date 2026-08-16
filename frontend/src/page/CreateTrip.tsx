import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface Profile {
    id: number;
    gender: string;
}

interface City {
    "@id": string;
    id: number;
    commune: string;
}

interface Preference {
    "@id": string;
    id: number;
    description: string;
}

interface Vehicle {
    "@id": string;
    id: number;
    seat?: number;
    description?: string | null;
}

interface CollectionResponse<T> {
    member?: T[];
    "hydra:member"?: T[];
}

interface CreatedResource {
    "@id": string;
    id: number;
}

type CreatorRole =
    | "DRIVER"
    | "PASSENGER";

interface FormState {
    departureCity: string;
    departureStreet: string;

    availableSeats: string;
    totalPrice: string;

    departureDate: string;
    departureHour: string;
    departureMinute: string;

    arrivalCity: string;
    arrivalStreet: string;

    arrivalDate: string;
    arrivalHour: string;
    arrivalMinute: string;

    creatorRole: CreatorRole;
    vehicle: string;

    womenOnly: boolean;
}

const today = (): string => {
    const now = new Date();

    const year =
        now.getFullYear();

    const month =
        String(
            now.getMonth() + 1,
        ).padStart(2, "0");

    const day =
        String(
            now.getDate(),
        ).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

const initialForm: FormState = {
    departureCity: "",
    departureStreet: "",

    availableSeats: "3",
    totalPrice: "0",

    departureDate: today(),
    departureHour: "",
    departureMinute: "",

    arrivalCity: "",
    arrivalStreet: "",

    arrivalDate: today(),
    arrivalHour: "",
    arrivalMinute: "",

    creatorRole: "DRIVER",
    vehicle: "",

    womenOnly: false,
};

export default function CreateTrip() {
    const navigate =
        useNavigate();

    const token =
        localStorage.getItem("token");

    const [form, setForm] =
        useState<FormState>(
            initialForm,
        );

    const [profile, setProfile] =
        useState<Profile | null>(
            null,
        );

    const [cities, setCities] =
        useState<City[]>([]);

    const [preferences, setPreferences] =
        useState<Preference[]>([]);

    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [submitting, setSubmitting] =
        useState(false);

    const [error, setError] =
        useState("");

    const authHeaders = {
        Authorization:
            `Bearer ${token}`,
        Accept:
            "application/ld+json",
    };

    const updateField =
        <K extends keyof FormState>(
            field: K,
            value: FormState[K],
        ) => {
            setForm(
                (current) => ({
                    ...current,
                    [field]: value,
                }),
            );
        };

    const readCollection =
        async <T,>(
            response: Response,
        ): Promise<T[]> => {
            if (!response.ok) {
                return [];
            }

            const data:
                CollectionResponse<T> =
                await response.json();

            return (
                data.member
                ?? data["hydra:member"]
                ?? []
            );
        };

    useEffect(() => {
        const loadData =
            async () => {
                setLoading(true);

                try {
                    const [
                        profileResponse,
                        citiesResponse,
                        preferencesResponse,
                        vehiclesResponse,
                    ] =
                        await Promise.all([
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

                            fetch(
                                `${API_URL}/api/cities`,
                                {
                                    headers:
                                        authHeaders,
                                },
                            ),

                            fetch(
                                `${API_URL}/api/preferences`,
                                {
                                    headers:
                                        authHeaders,
                                },
                            ),

                            fetch(
                                `${API_URL}/api/vehicles`,
                                {
                                    headers:
                                        authHeaders,
                                },
                            ),
                        ]);

                    if (
                        !profileResponse.ok
                    ) {
                        throw new Error(
                            "Impossible de charger votre profil.",
                        );
                    }

                    const profileData:
                        Profile =
                        await profileResponse.json();

                    setProfile(
                        profileData,
                    );

                    setCities(
                        await readCollection<City>(
                            citiesResponse,
                        ),
                    );

                    setPreferences(
                        await readCollection<Preference>(
                            preferencesResponse,
                        ),
                    );

                    setVehicles(
                        await readCollection<Vehicle>(
                            vehiclesResponse,
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

        void loadData();
    }, []);

    const findOrCreateCity =
        async (
            commune: string,
        ): Promise<City> => {
            const response =
                await fetch(
                    `${API_URL}/api/cities/find-or-create`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,

                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify({
                                commune:
                                    commune.trim(),
                            }),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    `Impossible de récupérer la ville "${commune}".`,
                );
            }

            const city: City =
                await response.json();

            return city;
        };

    const createAddress =
        async (
            commune: string,
            street: string,
        ): Promise<
            CreatedResource
        > => {
            const city =
                await findOrCreateCity(
                    commune,
                );

            const response =
                await fetch(
                    `${API_URL}/api/adresses`,
                    {
                        method: "POST",

                        headers: {
                            ...authHeaders,

                            "Content-Type":
                                "application/ld+json",
                        },

                        body:
                            JSON.stringify({
                                city:
                                    city["@id"],

                                street:
                                    street.trim(),

                                latitude:
                                    null,

                                longitude:
                                    null,
                            }),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Impossible de créer l'adresse.",
                );
            }

            return response.json();
        };

    const buildDateTime = (
        date: string,
        hour: string,
        minute: string,
    ): string => {
        const h =
            hour.padStart(
                2,
                "0",
            );

        const m =
            (minute || "00").padStart(
                2,
                "0",
            );

        return `${date}T${h}:${m}:00`;
    };

    const addWomenOnlyPreference =
        async (
            tripId: number,
        ) => {
            if (
                !form.womenOnly
                || profile?.gender
                !== "FEMALE"
            ) {
                return;
            }

            const womenPreference =
                preferences.find(
                    (
                        preference,
                    ) => {
                        const key =
                            preference
                                .description
                                .trim()
                                .toLowerCase()
                                .replaceAll(
                                    " ",
                                    "_",
                                );

                        return (
                            key
                            === "women_only"
                        );
                    },
                );

            if (!womenPreference) {
                throw new Error(
                    'La préférence "Femmes uniquement" est introuvable.',
                );
            }

            const response =
                await fetch(
                    `${API_URL}/api/trip_preferences`,
                    {
                        method: "POST",

                        headers: {
                            ...authHeaders,

                            "Content-Type":
                                "application/ld+json",
                        },

                        body:
                            JSON.stringify({
                                trip:
                                    `/api/trips/${tripId}`,

                                preference:
                                    womenPreference[
                                    "@id"
                                    ],

                                isActive:
                                    true,
                            }),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Le trajet a été créé, mais la préférence femmes uniquement n'a pas pu être enregistrée.",
                );
            }
        };

    const validateForm =
        (): string | null => {
            if (
                !form.departureCity.trim()
                || !form.departureStreet.trim()
                || !form.arrivalCity.trim()
                || !form.arrivalStreet.trim()
            ) {
                return "Les villes et adresses sont obligatoires.";
            }

            if (
                !form.departureDate
                || !form.arrivalDate
                || !form.departureHour
                || !form.departureMinute
                || !form.arrivalHour
            ) {
                return "Les dates et heures sont obligatoires.";
            }

            const seats =
                Number(
                    form.availableSeats,
                );

            if (
                !Number.isInteger(
                    seats,
                )
                || seats <= 0
            ) {
                return "Le nombre de places doit être supérieur à 0.";
            }

            const price =
                Number(
                    form.totalPrice,
                );

            if (
                Number.isNaN(price)
                || price < 0
            ) {
                return "Le prix doit être positif ou nul.";
            }

            const departure =
                new Date(
                    buildDateTime(
                        form.departureDate,
                        form.departureHour,
                        form.departureMinute,
                    ),
                );

            const arrival =
                new Date(
                    buildDateTime(
                        form.arrivalDate,
                        form.arrivalHour,
                        form.arrivalMinute,
                    ),
                );

            if (
                arrival <= departure
            ) {
                return "L'arrivée doit avoir lieu après le départ.";
            }

            return null;
        };

    const createTrip =
        async () => {
            setError("");

            const validationError =
                validateForm();

            if (validationError) {
                setError(
                    validationError,
                );
                return;
            }

            setSubmitting(true);

            try {
                const [
                    departureAddress,
                    arrivalAddress,
                ] =
                    await Promise.all([
                        createAddress(
                            form.departureCity,
                            form.departureStreet,
                        ),

                        createAddress(
                            form.arrivalCity,
                            form.arrivalStreet,
                        ),
                    ]);

                const seats =
                    Number(
                        form.availableSeats,
                    );

                const totalPrice =
                    Number(
                        form.totalPrice,
                    );

                const pricePerPassenger =
                    seats > 0
                        ? totalPrice
                        / seats
                        : 0;

                const body = {
                    departureDatetime:
                        buildDateTime(
                            form.departureDate,
                            form.departureHour,
                            form.departureMinute,
                        ),

                    estimatedArrivalDatetime:
                        buildDateTime(
                            form.arrivalDate,
                            form.arrivalHour,
                            form.arrivalMinute,
                        ),

                    totalPrice,

                    availableSeats:
                        seats,

                    pricePerPassenger,

                    tripCreatorRole:
                        form.creatorRole,

                    creator:
                        `/api/users/${profile?.id}`,

                    departureAddress:
                        departureAddress[
                        "@id"
                        ],

                    arrivalAddress:
                        arrivalAddress[
                        "@id"
                        ],

                    vehicle:
                        form.creatorRole
                            === "DRIVER"
                            && form.vehicle
                            ? form.vehicle
                            : null,
                };

                const response =
                    await fetch(
                        `${API_URL}/api/trips`,
                        {
                            method:
                                "POST",

                            headers: {
                                ...authHeaders,

                                "Content-Type":
                                    "application/ld+json",
                            },

                            body:
                                JSON.stringify(
                                    body,
                                ),
                        },
                    );

                if (!response.ok) {
                    const data =
                        await response.json();

                    throw new Error(
                        data.detail
                        ?? data.error
                        ?? "Impossible de créer le trajet.",
                    );
                }

                const trip:
                    CreatedResource =
                    await response.json();

                await addWomenOnlyPreference(
                    trip.id,
                );

                navigate(
                    `/trips/${trip.id}`,
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
                setSubmitting(false);
            }
        };

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
                Chargement...
            </p>
        );
    }

    return (
        <main
            className="
                mx-auto
                w-full
                max-w-[520px]
                bg-white
                px-4
                py-3
                pb-24
            "
        >
            {/* DEPART */}
            <h1
                className="
                    mb-1
                    text-xl
                    font-bold
                    uppercase
                    text-zinc-800
                "
            >
                Départ
            </h1>

            <section
                className="
                    space-y-4
                    rounded-md
                    bg-white
                    p-4
                "
            >
                <Input
                    label="Ville"
                    placeholder="Départ"
                    value={
                        form.departureCity
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "departureCity",
                                value,
                            )
                    }
                />

                <Input
                    label="Adresse précise"
                    placeholder="rue, blvd"
                    value={
                        form.departureStreet
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "departureStreet",
                                value,
                            )
                    }
                />

                <Input
                    label="Nombre de place"
                    type="number"
                    min="1"
                    value={
                        form.availableSeats
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "availableSeats",
                                value,
                            )
                    }
                />

                <Input
                    label="Coût du Trajet"
                    type="number"
                    min="0"
                    step="0.01"
                    value={
                        form.totalPrice
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "totalPrice",
                                value,
                            )
                    }
                />

                <Input
                    label="Date de départ"
                    type="date"
                    value={
                        form.departureDate
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "departureDate",
                                value,
                            )
                    }
                />

                <TimeInput
                    label="Heure de départ"
                    hour={
                        form.departureHour
                    }
                    minute={
                        form.departureMinute
                    }
                    onHourChange={
                        (value) =>
                            updateField(
                                "departureHour",
                                value,
                            )
                    }
                    onMinuteChange={
                        (value) =>
                            updateField(
                                "departureMinute",
                                value,
                            )
                    }
                />
            </section>

            {/* ARRIVEE */}
            <h2
                className="
                    mb-1
                    mt-5
                    text-xl
                    font-bold
                    uppercase
                    text-zinc-800
                "
            >
                Arrivée
            </h2>

            <section
                className="
                    space-y-4
                    rounded-md
                    bg-white
                    p-4
                "
            >
                <Input
                    label="Ville"
                    placeholder="Arrivée"
                    value={
                        form.arrivalCity
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "arrivalCity",
                                value,
                            )
                    }
                />

                <Input
                    label="Adresse précise"
                    placeholder="Rue, blvd"
                    value={
                        form.arrivalStreet
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "arrivalStreet",
                                value,
                            )
                    }
                />

                <Input
                    label="Date d'arrivée"
                    type="date"
                    value={
                        form.arrivalDate
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "arrivalDate",
                                value,
                            )
                    }
                />

                <TimeInput
                    label="Heure d'arrivée"
                    hour={
                        form.arrivalHour
                    }
                    minute={
                        form.arrivalMinute
                    }
                    onHourChange={
                        (value) =>
                            updateField(
                                "arrivalHour",
                                value,
                            )
                    }
                    onMinuteChange={
                        (value) =>
                            updateField(
                                "arrivalMinute",
                                value,
                            )
                    }
                />
            </section>

            {/* OPTIONS MVP */}
            <section
                className="
                    mt-5
                    space-y-4
                    rounded-md
                    bg-white
                    p-4
                "
            >
                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            mb-1
                            block
                            text-sm
                            text-zinc-700
                        "
                    >
                        Mon rôle
                    </span>

                    <select
                        value={
                            form.creatorRole
                        }
                        onChange={(event) => {
                            const value:
                                CreatorRole =
                                event.target.value
                                    === "PASSENGER"
                                    ? "PASSENGER"
                                    : "DRIVER";

                            updateField(
                                "creatorRole",
                                value,
                            );
                        }}
                        className="
                            h-10
                            w-full
                            rounded-md
                            border
                            border-zinc-300
                            bg-white
                            px-3
                            text-sm
                        "
                    >
                        <option
                            value="DRIVER"
                        >
                            Conducteur
                        </option>

                        <option
                            value="PASSENGER"
                        >
                            Passager
                        </option>
                    </select>
                </label>

                {form.creatorRole
                    === "DRIVER"
                    && vehicles.length > 0 && (
                        <label
                            className="
                            block
                        "
                        >
                            <span
                                className="
                                mb-1
                                block
                                text-sm
                                text-zinc-700
                            "
                            >
                                Véhicule
                            </span>

                            <select
                                value={
                                    form.vehicle
                                }
                                onChange={
                                    (event) =>
                                        updateField(
                                            "vehicle",
                                            event
                                                .target
                                                .value,
                                        )
                                }
                                className="
                                h-10
                                w-full
                                rounded-md
                                border
                                border-zinc-300
                                bg-white
                                px-3
                                text-sm
                            "
                            >
                                <option value="">
                                    Aucun véhicule
                                </option>

                                {vehicles.map(
                                    (
                                        vehicle,
                                    ) => (
                                        <option
                                            key={
                                                vehicle.id
                                            }
                                            value={
                                                vehicle[
                                                "@id"
                                                ]
                                            }
                                        >
                                            Véhicule #
                                            {
                                                vehicle.id
                                            }

                                            {vehicle.seat
                                                ? ` - ${vehicle.seat} places`
                                                : ""}
                                        </option>
                                    ),
                                )}
                            </select>
                        </label>
                    )}

                {profile?.gender
                    === "FEMALE" && (
                        <Toggle
                            label="Trajet réservé aux femmes"
                            checked={
                                form.womenOnly
                            }
                            onChange={() =>
                                updateField(
                                    "womenOnly",
                                    !form.womenOnly,
                                )
                            }
                        />
                    )}
            </section>

            {error && (
                <p
                    role="alert"
                    className="
                        mt-4
                        rounded-md
                        bg-red-50
                        p-3
                        text-sm
                        text-red-700
                    "
                >
                    {error}
                </p>
            )}

            <div
                className="
                    mt-5
                    flex
                    justify-center
                "
            >
                <button
                    type="button"
                    disabled={
                        submitting
                    }
                    onClick={() =>
                        void createTrip()
                    }
                    className="
                        min-w-44
                        rounded-md
                        bg-zinc-800
                        px-6
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        hover:bg-zinc-700
                        disabled:opacity-50
                    "
                >
                    {submitting
                        ? "Création..."
                        : "+ Créer le trajet"}
                </button>
            </div>
        </main>
    );
}

function Input({
    label,
    value,
    onChange,
    placeholder,
    type = "text",
    min,
    step,
}: {
    label: string;
    value: string;
    onChange:
    (value: string) => void;
    placeholder?: string;
    type?: string;
    min?: string;
    step?: string;
}) {
    return (
        <label
            className="
                block
            "
        >
            <span
                className="
                    mb-1
                    block
                    text-sm
                    text-zinc-700
                "
            >
                {label}
            </span>

            <input
                type={type}
                value={value}
                min={min}
                step={step}
                placeholder={
                    placeholder
                }
                onChange={
                    (event) =>
                        onChange(
                            event
                                .target
                                .value,
                        )
                }
                className="
                    h-10
                    w-full
                    rounded-md
                    border
                    border-zinc-300
                    px-3
                    text-sm
                    outline-none
                    placeholder:text-zinc-300
                    focus:border-sky-500
                "
            />
        </label>
    );
}

function TimeInput({
    label,
    hour,
    minute,
    onHourChange,
    onMinuteChange,
}: {
    label: string;
    hour: string;
    minute: string;
    onHourChange:
    (value: string) => void;
    onMinuteChange:
    (value: string) => void;
}) {
    return (
        <div>
            <span
                className="
                    mb-1
                    block
                    text-sm
                    text-zinc-700
                "
            >
                {label}
            </span>

            <div
                className="
                    flex
                    gap-2
                "
            >
                <input
                    type="number"
                    min="0"
                    max="23"
                    placeholder="17"
                    value={hour}
                    onChange={
                        (event) =>
                            onHourChange(
                                event
                                    .target
                                    .value
                                    .slice(
                                        0,
                                        2,
                                    ),
                            )
                    }
                    className="
                        h-10
                        w-24
                        rounded-md
                        border
                        border-zinc-300
                        px-3
                        text-sm
                        outline-none
                        placeholder:text-zinc-300
                    "
                />

                <input
                    type="number"
                    min="0"
                    max="59"
                    placeholder="20"
                    value={minute}
                    onChange={
                        (event) =>
                            onMinuteChange(
                                event
                                    .target
                                    .value
                                    .slice(
                                        0,
                                        2,
                                    ),
                            )
                    }
                    className="
                        h-10
                        w-24
                        rounded-md
                        border
                        border-zinc-300
                        px-3
                        text-sm
                        outline-none
                        placeholder:text-zinc-300
                    "
                />
            </div>
        </div>
    );
}

function Toggle({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                gap-3
            "
        >
            <span
                className="
                    text-sm
                    text-zinc-700
                "
            >
                {label}
            </span>

            <button
                type="button"
                role="switch"
                aria-checked={
                    checked
                }
                onClick={
                    onChange
                }
                className={`
                    relative
                    h-7
                    w-12
                    rounded-full
                    transition-colors
                    ${checked
                        ? "bg-emerald-500"
                        : "bg-zinc-300"
                    }
                `}
            >
                <span
                    className={`
                        absolute
                        left-1
                        top-1
                        h-5
                        w-5
                        rounded-full
                        bg-zinc-100
                        shadow
                        transition-transform
                        ${checked
                            ? "translate-x-5"
                            : "translate-x-0"
                        }
                    `}
                />
            </button>
        </div>
    );
}