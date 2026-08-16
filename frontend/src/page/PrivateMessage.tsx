import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import MessageCard from "../component/message/MessageCard";
import MessageComposer from "../component/message/MessageComposer";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface UserRef {
    "@id"?: string;
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
}

interface Message {
    "@id"?: string;
    id: number;
    sender?: UserRef | string;
    receiver?: UserRef | string | null;
    content: string;
    createdAt?: string;
}

interface MessageCollection {
    member?: Message[];
    "hydra:member"?: Message[];
}

export default function PrivateMessage() {
    const { tripId, userId } = useParams();

    const token =
        localStorage.getItem("token");

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [content, setContent] =
        useState("");

    const [loading, setLoading] =
        useState(true);

    const [sending, setSending] =
        useState(false);

    const [error, setError] =
        useState("");

    const authHeaders = {
        Authorization: `Bearer ${token}`,
        Accept: "application/ld+json",
    };

    const loadMessages = async () => {
        if (!tripId || !userId) {
            setError(
                "Conversation invalide.",
            );
            setLoading(false);
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `${API_URL}/api/trips/${tripId}/messages/${userId}`,
                {
                    headers:
                        authHeaders,
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Impossible de charger la conversation.",
                );
            }

            const data: MessageCollection =
                await response.json();

            setMessages(
                data.member
                ?? data["hydra:member"]
                ?? [],
            );
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Une erreur est survenue.",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void loadMessages();
    }, [tripId, userId]);

    const sendMessage = async () => {
        if (
            !tripId
            || !userId
            || !content.trim()
        ) {
            return;
        }

        setSending(true);
        setError("");

        try {
            const response = await fetch(
                `${API_URL}/api/messages`,
                {
                    method: "POST",

                    headers: {
                        ...authHeaders,
                        "Content-Type":
                            "application/ld+json",
                    },

                    body: JSON.stringify({
                        trip:
                            `/api/trips/${tripId}`,

                        receiver:
                            `/api/users/${userId}`,

                        content:
                            content.trim(),
                    }),
                },
            );

            if (!response.ok) {
                throw new Error(
                    "Impossible d'envoyer le message.",
                );
            }

            setContent("");

            await loadMessages();
        } catch (caughtError) {
            setError(
                caughtError instanceof Error
                    ? caughtError.message
                    : "Une erreur est survenue.",
            );
        } finally {
            setSending(false);
        }
    };

    const getAuthorName = (
        sender?: UserRef | string,
    ) => {
        if (!sender) {
            return "Utilisateur";
        }

        if (typeof sender === "string") {
            return "Utilisateur";
        }

        const fullName = [
            sender.firstName,
            sender.lastName,
        ]
            .filter(Boolean)
            .join(" ");

        return (
            fullName
            || sender.email
            || "Utilisateur"
        );
    };

    const isMyMessage = (
        sender?: UserRef | string,
    ) => {
        if (!sender) {
            return false;
        }

        /*
         * Tant qu'on ne récupère pas l'id du user
         * connecté côté front, on déduit ici
         * simplement que l'autre user est userId.
         */
        if (typeof sender === "string") {
            return (
                sender
                !== `/api/users/${userId}`
            );
        }

        return (
            sender.id
            !== Number(userId)
        );
    };

    return (
        <div
            className="
                flex
                min-h-full
                flex-col
                bg-white
                pb-20
            "
        >
            {/* Header conversation */}
            <div
                className="
                    border-b
                    border-zinc-200
                    px-4
                    py-4
                "
            >
                <p
                    className="
                        text-sm
                        text-zinc-500
                    "
                >
                    Discussion avec :
                </p>

                <h1
                    className="
                        text-xl
                        font-bold
                        text-zinc-900
                    "
                >
                    Utilisateur #{userId}
                </h1>
            </div>

            {/* Messages */}
            <main
                className="
                    flex-1
                    space-y-4
                    overflow-y-auto
                    px-4
                    py-5
                "
            >
                {loading && (
                    <p
                        className="
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
                        role="alert"
                        className="
                            rounded-md
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
                    && messages.length === 0 && (
                    <p
                        className="
                            text-center
                            text-sm
                            text-zinc-400
                        "
                    >
                        Aucun message pour le moment.
                    </p>
                )}

                {messages.map((message) => (
                    <MessageCard
                        key={message.id}
                        authorName={
                            getAuthorName(
                                message.sender,
                            )
                        }
                        content={
                            message.content
                        }
                        createdAt={
                            message.createdAt
                        }
                        isMine={
                            isMyMessage(
                                message.sender,
                            )
                        }
                    />
                ))}
            </main>

            {/* Composer */}
            <div
                className="
                    sticky
                    bottom-0
                    border-t
                    border-zinc-200
                    bg-white
                    px-4
                    py-3
                "
            >
                <MessageComposer
                    value={content}
                    onChange={
                        setContent
                    }
                    onSend={
                        sendMessage
                    }
                    loading={
                        sending
                    }
                />
            </div>
        </div>
    );
}