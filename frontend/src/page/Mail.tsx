import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import ConversationCard from "../component/message/ConversationCard";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface UserRef {
    "@id"?: string;
    id?: number;
    firstName?: string;
    lastName?: string;
    email?: string;
}

interface TripRef {
    "@id"?: string;
    id?: number;
}

interface Message {
    id: number;
    sender?: UserRef | string;
    receiver?: UserRef | string | null;
    trip?: TripRef | string | null;
    content: string;
    active?: boolean;
    read?: boolean;
    isRead?: boolean;
    createdAt?: string;
}

interface MessageCollection {
    member?: Message[];
    "hydra:member"?: Message[];
}

interface Profile {
    id: number;
}

interface Conversation {
    key: string;
    type: "private" | "trip";
    tripId: number;
    userId?: number;
    title: string;
    subtitle?: string;
    lastMessage: string;
    lastMessageAt?: string;
    unread: boolean;
}

export default function Mail() {
    const navigate = useNavigate();

    const token =
        localStorage.getItem("token");

    const [messages, setMessages] =
        useState<Message[]>([]);

    const [currentUserId, setCurrentUserId] =
        useState<number | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const authHeaders = {
        Authorization: `Bearer ${token}`,
        Accept: "application/ld+json",
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");

            try {
                const [
                    profileResponse,
                    messageResponse,
                ] = await Promise.all([
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
                        `${API_URL}/api/messages`,
                        {
                            headers:
                                authHeaders,
                        },
                    ),
                ]);

                if (
                    !profileResponse.ok
                    || !messageResponse.ok
                ) {
                    throw new Error(
                        "Impossible de charger la messagerie.",
                    );
                }

                const profile: Profile =
                    await profileResponse.json();

                const data: MessageCollection =
                    await messageResponse.json();

                setCurrentUserId(
                    profile.id,
                );

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

        void load();
    }, []);

    const conversations = useMemo(
        () =>
            buildConversations(
                messages,
                currentUserId,
            ),
        [
            messages,
            currentUserId,
        ],
    );

    const openConversation = (
        conversation: Conversation,
    ) => {
        if (
            conversation.type === "trip"
        ) {
            navigate(
                `/trips/${conversation.tripId}/messages`,
            );

            return;
        }

        if (
            conversation.userId
            === undefined
        ) {
            return;
        }

        navigate(
            `/trips/${conversation.tripId}/messages/${conversation.userId}`,
        );
    };

    return (
        <div
            className="
                w-full
                bg-white
                pb-20
            "
        >
            <div
                className="
                    border-b
                    border-zinc-200
                    px-4
                    py-4
                "
            >
                <h1
                    className="
                        text-xl
                        font-bold
                        text-zinc-900
                    "
                >
                    Historique de messagerie
                </h1>
            </div>

            {loading && (
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
            )}

            {error && (
                <p
                    role="alert"
                    className="
                        m-4
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
                && conversations.length === 0 && (
                <p
                    className="
                        py-10
                        text-center
                        text-sm
                        text-zinc-400
                    "
                >
                    Aucune conversation.
                </p>
            )}

            {!loading
                && !error
                && conversations.map(
                    (conversation) => (
                        <ConversationCard
                            key={
                                conversation.key
                            }
                            title={
                                conversation.title
                            }
                            subtitle={
                                conversation.subtitle
                            }
                            lastMessage={
                                conversation.lastMessage
                            }
                            lastMessageAt={
                                conversation.lastMessageAt
                            }
                            unread={
                                conversation.unread
                            }
                            onClick={() =>
                                openConversation(
                                    conversation,
                                )
                            }
                        />
                    ),
                )}
        </div>
    );
}

function buildConversations(
    messages: Message[],
    currentUserId: number | null,
): Conversation[] {
    if (currentUserId === null) {
        return [];
    }

    const conversations =
        new Map<string, Conversation>();

    const sortedMessages = [
        ...messages,
    ].sort(
        (a, b) =>
            new Date(
                b.createdAt ?? 0,
            ).getTime()
            -
            new Date(
                a.createdAt ?? 0,
            ).getTime(),
    );

    for (const message of sortedMessages) {
        const tripId =
            extractId(
                message.trip,
            );

        if (tripId === null) {
            continue;
        }

        /*
         * receiver === null
         * => message collectif
         */
        if (!message.receiver) {
            const key =
                `trip-${tripId}`;

            if (
                conversations.has(key)
            ) {
                continue;
            }

            conversations.set(
                key,
                {
                    key,
                    type: "trip",
                    tripId,
                    title:
                        `Voyage #${tripId}`,
                    subtitle:
                        "Conversation du trajet",
                    lastMessage:
                        message.content,
                    lastMessageAt:
                        message.createdAt,
                    unread:
                        !getReadState(
                            message,
                        ),
                },
            );

            continue;
        }

        /*
         * Conversation privée
         */
        const senderId =
            extractId(
                message.sender,
            );

        const receiverId =
            extractId(
                message.receiver,
            );

        if (
            senderId === null
            || receiverId === null
        ) {
            continue;
        }

        const otherUserId =
            senderId === currentUserId
                ? receiverId
                : senderId;

        const key =
            `private-${tripId}-${otherUserId}`;

        if (
            conversations.has(key)
        ) {
            continue;
        }

        const otherUser =
            senderId === otherUserId
                ? message.sender
                : message.receiver;

        conversations.set(
            key,
            {
                key,
                type: "private",
                tripId,
                userId:
                    otherUserId,
                title:
                    getUserName(
                        otherUser,
                        otherUserId,
                    ),
                subtitle:
                    `Voyage #${tripId}`,
                lastMessage:
                    message.content,
                lastMessageAt:
                    message.createdAt,
                unread:
                    receiverId
                        === currentUserId
                        && !getReadState(
                            message,
                        ),
            },
        );
    }

    return Array.from(
        conversations.values(),
    );
}

function extractId(
    value?:
        | UserRef
        | TripRef
        | string
        | null,
): number | null {
    if (!value) {
        return null;
    }

    if (
        typeof value === "object"
    ) {
        return value.id ?? null;
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
    user:
        | UserRef
        | string
        | null
        | undefined,
    fallbackId: number,
): string {
    if (
        !user
        || typeof user === "string"
    ) {
        return (
            `Utilisateur #${fallbackId}`
        );
    }

    const fullName = [
        user.firstName,
        user.lastName,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        fullName
        || user.email
        || `Utilisateur #${fallbackId}`
    );
}

function getReadState(
    message: Message,
): boolean {
    return (
        message.isRead
        ?? message.read
        ?? false
    );
}