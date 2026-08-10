
import {
    CalendarDays,
    CarFront,
    Search,
    Venus,
} from "lucide-react";
import {
    useState,
} from "react";
import { useNavigate } from "react-router-dom";

import TripCard from "../component/TripCard";
import type { Trip } from "../component/TripCard";
import type { SubmitEvent } from "react";

interface SearchForm {
    departureCommune: string;
    arrivalCommune: string;
    departureDate: string;
    departureTime: string;
    preferences: string[];
    lookingForDriver: boolean;
}

interface TripCollectionResponse {
    member: Trip[];
}

interface PreferenceOption {
    description: string;
    label: string;
}

const API_URL =
    import.meta.env.VITE_API_URL
    ?? "http://localhost:8080";

const PREFERENCES: PreferenceOption[] = [
    {
        description: "women_only",
        label: "Femmes uniquement",
    },
    {
        description: "quiet_trip",
        label: "Trajet calme",
    },
    {
        description: "music_allowed",
        label: "Musique autorisée",
    },
    {
        description: "non_smoking",
        label: "Non-fumeur",
    },
];

const initialForm: SearchForm = {
    departureCommune: "",
    arrivalCommune: "",
    departureDate: new Date().toISOString().slice(0, 10),
    departureTime: "",
    preferences: [],
    lookingForDriver: false,
};

interface ToggleProps {
    checked: boolean;
    label: string;
    onChange: () => void;
}

function Toggle({
    checked,
    label,
    onChange,
}: ToggleProps) {
    return (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={onChange}
            className={`
                relative h-6 w-11 shrink-0 rounded-full
                transition-colors
                focus:outline-none
                focus-visible:ring-2
                focus-visible:ring-sky-500
                focus-visible:ring-offset-2
                ${checked ? "bg-sky-600" : "bg-zinc-700"}
            `}
        >
            <span
                aria-hidden="true"
                className={`
                    absolute top-1 h-4 w-4 rounded-full
                    bg-white shadow transition-transform
                    ${checked
                        ? "translate-x-6"
                        : "translate-x-1"}
                `}
            />
        </button>
    );
}

export default function SearchResult() {
    const navigate = useNavigate();

    const [form, setForm] =
        useState<SearchForm>(initialForm);

    const [trips, setTrips] = useState<Trip[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [hasSearched, setHasSearched] = useState(false);
    const [error, setError] = useState("");

    // Update one form field.
    const updateField = <Key extends keyof SearchForm>(
        key: Key,
        value: SearchForm[Key],
    ) => {
        setForm((current) => ({
            ...current,
            [key]: value,
        }));
    };

    // Add or remove one preference.
    const togglePreference = (description: string) => {
        setForm((current) => ({
            ...current,
            preferences: current.preferences.includes(description)
                ? current.preferences.filter(
                    (item) => item !== description,
                )
                : [
                    ...current.preferences,
                    description,
                ],
        }));
    };

    // Build query parameters sent to the backend.
    const buildSearchParams = () => {
        const params = new URLSearchParams();

        Object.entries({
            departureCommune:
                form.departureCommune.trim(),
            arrivalCommune:
                form.arrivalCommune.trim(),
            departureDate:
                form.departureDate,
            departureTime:
                form.departureTime,
        }).forEach(([key, value]) => {
            if (value) {
                params.set(key, value);
            }
        });

        form.preferences.forEach((preference) => {
            params.append(
                "preferences[]",
                preference,
            );
        });

        if (form.lookingForDriver) {
            params.set(
                "tripCreatorRole",
                "PASSENGER",
            );
        }

        return params;
    };

    const handleSubmit = async (
        event: SubmitEvent<HTMLFormElement>,
    ) => {
        event.preventDefault();

        setIsLoading(true);
        setHasSearched(true);
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/trips/search?${buildSearchParams()}`,
                {
                    headers: {
                        Accept: "application/ld+json",
                        ...(token && {
                            Authorization: `Bearer ${token}`,
                        }),
                    },
                },
            );

            if (!response.ok) {
                throw new Error(
                    "La recherche des trajets a échoué.",
                );
            }

            const data =
                await response.json() as TripCollectionResponse;

            setTrips(data.member ?? []);
        } catch (caughtError) {
            setTrips([]);

            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Une erreur inattendue est survenue.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main
            className="
                mx-auto flex h-dvh w-full max-w-md
                flex-col overflow-hidden bg-white
            "
        >
            <section
                aria-labelledby="search-title"
                className="
                    shrink-0 border-b border-zinc-200
                    bg-white px-4 py-4
                "
            >
                <div className="mb-3 flex items-center gap-2">
                    <Search
                        aria-hidden="true"
                        size={21}
                        className="text-sky-600"
                    />

                    <h1
                        id="search-title"
                        className="
                            text-lg font-semibold
                            text-zinc-800
                        "
                    >
                        Rechercher un trajet
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="
                        space-y-3 rounded-xl border
                        border-zinc-300 bg-white p-3
                        shadow-sm
                    "
                >
                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-zinc-700">
                                Départ
                            </span>

                            <input
                                type="text"
                                value={form.departureCommune}
                                placeholder="Ville de départ"
                                onChange={(event) =>
                                    updateField(
                                        "departureCommune",
                                        event.target.value,
                                    )
                                }
                                className="
                                    h-10 rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-100
                                "
                            />
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-zinc-700">
                                Arrivée
                            </span>

                            <input
                                type="text"
                                value={form.arrivalCommune}
                                placeholder="Ville d'arrivée"
                                onChange={(event) =>
                                    updateField(
                                        "arrivalCommune",
                                        event.target.value,
                                    )
                                }
                                className="
                                    h-10 rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-100
                                "
                            />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-zinc-700">
                                Date
                            </span>

                            <span className="relative">
                                <CalendarDays
                                    aria-hidden="true"
                                    size={16}
                                    className="
                                        pointer-events-none
                                        absolute right-3 top-1/2
                                        -translate-y-1/2
                                        text-zinc-500
                                    "
                                />

                                <input
                                    type="date"
                                    value={form.departureDate}
                                    onChange={(event) =>
                                        updateField(
                                            "departureDate",
                                            event.target.value,
                                        )
                                    }
                                    className="
                                        h-10 w-full rounded-lg
                                        border border-zinc-300
                                        px-3 pr-9 text-sm
                                        outline-none
                                        focus:border-sky-500
                                        focus:ring-2
                                        focus:ring-sky-100
                                    "
                                />
                            </span>
                        </label>

                        <label className="flex flex-col gap-1">
                            <span className="text-xs font-medium text-zinc-700">
                                Heure
                            </span>

                            <input
                                type="time"
                                value={form.departureTime}
                                onChange={(event) =>
                                    updateField(
                                        "departureTime",
                                        event.target.value,
                                    )
                                }
                                className="
                                    h-10 rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                    focus:ring-2
                                    focus:ring-sky-100
                                "
                            />
                        </label>
                    </div>

                    <fieldset className="space-y-2">
                        <legend className="text-xs font-medium text-zinc-700">
                            Préférences
                        </legend>

                        <div className="grid grid-cols-2 gap-2">
                            {PREFERENCES.map((preference) => (
                                <label
                                    key={preference.description}
                                    className="
                                        flex items-center
                                        justify-between gap-2
                                        rounded-lg bg-zinc-50
                                        px-3 py-2 text-xs
                                        text-zinc-700
                                    "
                                >
                                    <span className="flex items-center gap-1">
                                        {preference.description
                                            === "women_only" && (
                                                <Venus
                                                    aria-hidden="true"
                                                    size={16}
                                                    className="text-pink-600"
                                                />
                                            )}

                                        {preference.label}
                                    </span>

                                    <Toggle
                                        checked={form.preferences.includes(
                                            preference.description,
                                        )}
                                        label={preference.label}
                                        onChange={() =>
                                            togglePreference(
                                                preference.description,
                                            )
                                        }
                                    />
                                </label>
                            ))}
                        </div>
                    </fieldset>

                    <label
                        className="
                            flex items-center justify-between
                            rounded-lg bg-zinc-50
                            px-3 py-2 text-xs
                            text-zinc-700
                        "
                    >
                        <span className="flex items-center gap-2">
                            <CarFront
                                aria-hidden="true"
                                size={18}
                            />

                            Recherche un conducteur
                        </span>

                        <Toggle
                            checked={form.lookingForDriver}
                            label="Trajets recherchant un conducteur"
                            onChange={() =>
                                updateField(
                                    "lookingForDriver",
                                    !form.lookingForDriver,
                                )
                            }
                        />
                    </label>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="
                            flex h-10 w-full items-center
                            justify-center gap-2 rounded-lg
                            bg-sky-600 text-sm font-semibold
                            text-white transition
                            hover:bg-sky-700
                            disabled:cursor-wait
                            disabled:opacity-60
                            focus:outline-none
                            focus-visible:ring-2
                            focus-visible:ring-sky-500
                            focus-visible:ring-offset-2
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

            <section
                aria-labelledby="results-title"
                className="
                    min-h-0 flex-1 overflow-y-auto
                    bg-zinc-100 px-3 py-3
                "
            >
                <h2
                    id="results-title"
                    className="
                        mb-3 text-sm font-semibold
                        text-zinc-800
                    "
                >
                    <strong>Trajets</strong>  disponibles
                </h2>

                {error && (
                    <div
                        role="alert"
                        className="
                            rounded-lg border border-red-200
                            bg-red-50 p-3 text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}
                {/*TripCard display*/}
                {!error && trips.length > 0 && (
                    <div className="flex flex-col gap-3 pb-6">
                        {trips.map((trip) => (
                            <TripCard
                                key={trip.id}
                                trip={trip}
                                onClick={(tripId) =>
                                    navigate(
                                        `/trips/${tripId}`,
                                    )
                                }
                            />
                        ))}
                    </div>
                )}

                {!error
                    && hasSearched
                    && !isLoading
                    && trips.length === 0 && (
                        <div
                            className="
                                flex min-h-52 flex-col
                                items-center justify-center
                                rounded-xl border
                                border-dashed border-zinc-300
                                bg-white px-6 text-center
                            "
                        >
                            <Search
                                aria-hidden="true"
                                size={34}
                                className="
                                    mb-3 text-zinc-400
                                "
                            />

                            <h3 className="font-semibold text-zinc-800">
                                Aucun trajet trouvé
                            </h3>

                            <p className="mt-1 text-sm text-zinc-500">
                                Créez votre <strong>trajet</strong> pour trouver
                                un <em>conducteur</em> ou des <em>passagers</em>.
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/trips/create")
                                }
                                className="
                                    mt-4 rounded-lg bg-sky-600
                                    px-4 py-2 text-sm
                                    font-semibold text-white
                                    transition hover:bg-sky-700
                                    focus:outline-none
                                    focus-visible:ring-2
                                    focus-visible:ring-sky-500
                                    focus-visible:ring-offset-2
                                "
                            >
                                Créer un <strong>trajet</strong>
                            </button>
                        </div>
                    )}
            </section>
        </main>
    );
}