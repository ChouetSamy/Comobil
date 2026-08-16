interface ConversationCardProps {
    title: string;
    subtitle?: string;
    lastMessage?: string;
    lastMessageAt?: string;
    unread?: boolean;
    onClick: () => void;
}

export default function ConversationCard({
    title,
    subtitle,
    lastMessage,
    lastMessageAt,
    unread = false,
    onClick,
}: ConversationCardProps) {
    const formattedDate = lastMessageAt
        ? new Date(lastMessageAt).toLocaleString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
          })
        : "";

    return (
        <button
            type="button"
            onClick={onClick}
            className="
                flex
                w-full
                items-start
                gap-3
                border-b
                border-zinc-200
                bg-white
                px-4
                py-4
                text-left
                transition
                hover:bg-zinc-50
            "
        >
            <div
                className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-zinc-200
                    text-lg
                    font-semibold
                    text-zinc-600
                "
            >
                {title.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2
                    "
                >
                    <h2
                        className={`
                            truncate
                            text-sm
                            ${
                                unread
                                    ? "font-bold text-zinc-900"
                                    : "font-semibold text-zinc-800"
                            }
                        `}
                    >
                        {title}
                    </h2>

                    {formattedDate && (
                        <span
                            className="
                                shrink-0
                                text-[10px]
                                text-zinc-400
                            "
                        >
                            {formattedDate}
                        </span>
                    )}
                </div>

                {subtitle && (
                    <p
                        className="
                            mt-0.5
                            truncate
                            text-xs
                            text-sky-600
                        "
                    >
                        {subtitle}
                    </p>
                )}

                {lastMessage && (
                    <p
                        className="
                            mt-1
                            truncate
                            text-xs
                            text-zinc-500
                        "
                    >
                        {lastMessage}
                    </p>
                )}
            </div>

            {unread && (
                <span
                    className="
                        mt-2
                        h-2.5
                        w-2.5
                        shrink-0
                        rounded-full
                        bg-sky-500
                    "
                />
            )}
        </button>
    );
}