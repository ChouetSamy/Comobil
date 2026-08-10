import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import logo from "../assets/Comobil_Logo.png";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface RegisterForm {
    lastName: string;
    firstName: string;
    email: string;
    phone: string;
    gender: string;
    password: string;
    passwordConfirmation: string;
}

export default function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState<RegisterForm>({
        lastName: "",
        firstName: "",
        email: "",
        phone: "",
        gender: "",
        password: "",
        passwordConfirmation: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Update one field of the registration form.
    const updateField = (
        field: keyof RegisterForm,
        value: string,
    ) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    // Format a French phone number for better readability.
    const formatPhone = (value: string) =>
        value
            .replace(/\D/g, "")
            .slice(0, 10)
            .replace(/(\d{2})(?=\d)/g, "$1 ");

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> =
        async (event) => {
            event.preventDefault();

            if (form.password !== form.passwordConfirmation) {
                setError(
                    "Les mots de passe ne correspondent pas.",
                );
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await fetch(
                    `${API_URL}/register`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            email: form.email,
                            password: form.password,
                            first_name: form.firstName,
                            last_name: form.lastName,

                            // Remove display spaces before sending.
                            phone: form.phone.replace(/\s/g, ""),

                            gender: form.gender,
                        }),
                    },
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.error
                        ?? data.errors?.[0]
                        ?? "Impossible de créer le compte.",
                    );
                }

                // Automatically authenticate the newly registered user.
                const loginResponse = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: form.email,
                        password: form.password,
                    }),
                });

                if (!loginResponse.ok) {
                    throw new Error(
                        "Compte créé, mais la connexion automatique a échoué.",
                    );
                }

                const loginData = await loginResponse.json();

                login(loginData.token);
                navigate("/trips/search");
            } catch (caughtError) {
                setError(
                    caughtError instanceof Error
                        ? caughtError.message
                        : "Impossible de créer le compte.",
                );
            } finally {
                setLoading(false);
            }
        };

    return (
        <main
            className="
                flex min-h-dvh w-full
                flex-col items-center
                bg-white px-4 py-5
            "
        >
            <div className="flex flex-col items-center">
                <img
                    src={logo}
                    alt="Comobil"
                    className="
                        h-auto
                        w-[65%]
                        max-w-[268px]
                    "
                />

                <p className="-mt-1 text-[14px] text-zinc-900">
                    avec{" "}
                    <strong>Comobil</strong>
                    , tous roulent
                </p>
            </div>

            <section
                aria-labelledby="register-title"
                className="
                    mt-4
                    flex
                    min-h-0
                    w-full
                    max-w-[412px]
                    flex-1
                    flex-col
                "
            >
                <h1
                    id="register-title"
                    className="
                        mb-5
                        text-center
                        text-2xl
                        font-medium
                        text-zinc-900
                    "
                >
                    Inscription
                </h1>

                {/* Scrollable form area */}
                <div className="min-h-0 flex-1 overflow-y-auto">
                    <form
                        onSubmit={handleSubmit}
                        className="
                            space-y-3
                            rounded-xl
                            border
                            border-zinc-200
                            bg-white
                            p-4
                        "
                    >
                        <label className="block">
                            <span className="text-sm text-zinc-800">
                                Nom
                            </span>

                            <input
                                type="text"
                                required
                                value={form.lastName}
                                placeholder="Nom"
                                onChange={(event) =>
                                    updateField(
                                        "lastName",
                                        event.target.value,
                                    )
                                }
                                className="
                                    mt-1 h-10 w-full
                                    rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-zinc-800">
                                Prénom
                            </span>

                            <input
                                type="text"
                                required
                                value={form.firstName}
                                placeholder="Prénom"
                                onChange={(event) =>
                                    updateField(
                                        "firstName",
                                        event.target.value,
                                    )
                                }
                                className="
                                    mt-1 h-10 w-full
                                    rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-zinc-800">
                                Email
                            </span>

                            <input
                                type="email"
                                required
                                autoComplete="email"
                                value={form.email}
                                placeholder="Email"
                                onChange={(event) =>
                                    updateField(
                                        "email",
                                        event.target.value,
                                    )
                                }
                                className="
                                    mt-1 h-10 w-full
                                    rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-zinc-800">
                                Téléphone
                            </span>

                            <input
                                type="tel"
                                required
                                autoComplete="tel"
                                inputMode="numeric"
                                value={form.phone}
                                placeholder="06 12 34 56 78"
                                onChange={(event) =>
                                    updateField(
                                        "phone",
                                        formatPhone(
                                            event.target.value,
                                        ),
                                    )
                                }
                                className="
                                    mt-1 h-10 w-full
                                    rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-zinc-800">
                                Genre
                            </span>

                            <select
                                required
                                value={form.gender}
                                onChange={(event) =>
                                    updateField(
                                        "gender",
                                        event.target.value,
                                    )
                                }
                                className="
                                    mt-1 h-10 w-full
                                    rounded-lg border
                                    border-zinc-300
                                    bg-white px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            >
                                <option value="">
                                    Sélectionner
                                </option>

                                <option value="MALE">
                                    Homme
                                </option>

                                <option value="FEMALE">
                                    Femme
                                </option>

                                <option value="OTHER">
                                    Autre
                                </option>
                            </select>
                        </label>

                        <label className="block">
                            <span className="text-sm text-zinc-800">
                                Mot de passe
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={form.password}
                                placeholder="**********"
                                onChange={(event) =>
                                    updateField(
                                        "password",
                                        event.target.value,
                                    )
                                }
                                className="
                                    mt-1 h-10 w-full
                                    rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label className="block">
                            <span className="text-sm text-zinc-800">
                                Confirmation mot de passe
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                required
                                minLength={8}
                                autoComplete="new-password"
                                value={form.passwordConfirmation}
                                placeholder="**********"
                                onChange={(event) =>
                                    updateField(
                                        "passwordConfirmation",
                                        event.target.value,
                                    )
                                }
                                className="
                                    mt-1 h-10 w-full
                                    rounded-lg border
                                    border-zinc-300 px-3
                                    text-sm outline-none
                                    focus:border-sky-500
                                "
                            />
                        </label>

                        <label
                            className="
                                flex items-center gap-2
                                text-sm text-zinc-700
                            "
                        >
                            <input
                                type="checkbox"
                                checked={showPassword}
                                onChange={(event) =>
                                    setShowPassword(
                                        event.target.checked,
                                    )
                                }
                            />

                            Afficher les mots de passe
                        </label>

                        {error && (
                            <p
                                role="alert"
                                className="text-sm text-red-600"
                            >
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                                h-10 w-full
                                rounded-lg
                                bg-zinc-800
                                text-sm font-medium
                                text-white
                                hover:bg-sky-600
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Envoi..."
                                : "Envoyer"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-sm">
                        Déjà inscrit ?{" "}
                        <Link
                            to="/login"
                            className="underline"
                        >
                            Se connecter
                        </Link>
                    </p>
                </div>
            </section>
        </main>
    );
}