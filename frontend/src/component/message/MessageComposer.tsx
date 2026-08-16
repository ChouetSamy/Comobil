import type { FormEvent } from "react";

interface MessageComposerProps {
    value: string;
    onChange: (value: string) => void;
    onSend: () => void | Promise<void>;
    loading?: boolean;
}

export default function MessageComposer({
    value,
    onChange,
    onSend,
    loading = false,
}: MessageComposerProps) {
    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!value.trim() || loading) {
            return;
        }

        await onSend();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3"
        >
            <input
                type="text"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Écrire un message..."
                disabled={loading}
                className="
                    min-w-0
                    flex-1
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    px-4
                    py-3
                    text-sm
                    outline-none
                    focus:border-blue-500
                    disabled:opacity-60
                "
            />

            <button
                type="submit"
                disabled={loading || !value.trim()}
                className="
                    rounded-lg
                    bg-blue-600
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >
                {loading ? "Envoi..." : "Envoyer"}
            </button>
        </form>
    );
}