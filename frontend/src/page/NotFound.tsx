import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <section
            className="
                flex min-h-[70vh]
                flex-col items-center justify-center
                px-6 text-center
            "
        >
            <p className="text-7xl font-bold text-sky-600">
                404
            </p>

            <h1 className="mt-4 text-2xl font-semibold text-zinc-900">
                Page introuvable
            </h1>

            <p className="mt-2 max-w-sm text-zinc-600">
                La page que vous recherchez n'existe pas
                ou n'est plus disponible.
            </p>

            <Link
                to="/"
                className="
                    mt-6 flex items-center gap-2
                    rounded-lg bg-zinc-800
                    px-5 py-3
                    text-sm font-medium text-white
                    transition hover:bg-sky-600
                "
            >
                <Home size={18} />
                Retour à l'accueil
            </Link>
        </section>
    );
}