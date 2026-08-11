import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import logo from "../assets/Comobil_Logo.png";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit: React.SubmitEventHandler<HTMLFormElement> =
        async (event) => {
            event.preventDefault();

            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email,
                        password,
                    }),
                });

                if (!response.ok) {
                    throw new Error("Identifiants incorrects.");
                }

                const data = await response.json();

                login(data.token);
                navigate("/trips/search");
            } catch {
                setError("Identifiants incorrects.");
            } finally {
                setLoading(false);
            }
        };

    return (
        <main
            className="
                min-h-dvh
                w-full
                bg-white
                px-6
                pt-5
                text-zinc-900
            "
        >
            <div className="mx-auto flex w-full max-w-[412px] flex-col">
                {/* Logo */}
                <div className="flex flex-col items-center">
                    <img
                        src={logo}
                        alt="Comobil"
                        className="
                            h-auto
                            w-[65%]
                            max-w-[268px]
                            object-contain
                        "
                    />

                    <p className="-mt-1 text-[16px] text-zinc-900">
                        avec{" "}
                        <strong>Comobil</strong>
                        , tous roulent
                    </p>
                </div>

                {/* Login form */}
                <section
                    aria-labelledby="login-title"
                    className="mt-20 w-full"
                >
                    <h1
                        id="login-title"
                        className="
                            mb-8
                            text-center
                            text-2xl
                            font-medium
                        "
                    >
                        Connexion
                    </h1>

                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4"
                    >
                        <label
                            htmlFor="email"
                            className="sr-only"
                        >
                            Adresse e-mail
                        </label>

                        <input
                            id="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="Votre email..."
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            className="
                                h-10
                                w-full
                                bg-zinc-200
                                px-3
                                text-sm
                                outline-none
                                placeholder:text-zinc-400
                                focus:ring-2
                                focus:ring-sky-500
                            "
                        />

                        <label
                            htmlFor="password"
                            className="sr-only"
                        >
                            Mot de passe
                        </label>

                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            required
                            autoComplete="current-password"
                            placeholder="Mot de passe..."
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            className="
                                h-10
                                w-full
                                bg-zinc-200
                                px-3
                                text-sm
                                outline-none
                                placeholder:text-zinc-400
                                focus:ring-2
                                focus:ring-sky-500
                            "
                        />

                        {/* Show / hide password */}
                        <label
                            className="
                                flex
                                items-center
                                gap-2
                                text-sm
                                text-zinc-700
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

                            Afficher le mot de passe
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
                                mt-1
                                h-10
                                w-36
                                bg-zinc-800
                                text-sm
                                font-medium
                                text-white
                                transition
                                hover:bg-sky-600
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Connexion..."
                                : "Se connecter"}
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-zinc-800">
                        Pas de compte ?{" "}
                        <Link
                            to="/register"
                            className="
                                underline
                                hover:text-sky-600
                            "
                        >
                            Créer un compte.
                        </Link>
                    </p>
                </section>
            </div>
        </main>
    );
}