interface MessageCardProps {
    authorName: string;
    content: string;
    createdAt?: string;
    isMine?: boolean;
}

export default function MessageCard({
    authorName,
    content,
    createdAt,
    isMine = false,
}: MessageCardProps) {
    const formattedTime = createdAt
        ? new Date(createdAt).toLocaleTimeString("fr-FR", {
              hour: "2-digit",
              minute: "2-digit",
          })
        : null;

    return (
        <div
            className={`flex w-full ${
                isMine ? "justify-end" : "justify-start"
            }`}
        >
            <div className="max-w-[85%]">
                <div
                    className={`mb-1 text-sm ${
                        isMine ? "text-right" : "text-left"
                    }`}
                >
                    <span className="font-semibold">
                        {isMine ? "Vous" : authorName}
                    </span>

                    {formattedTime && (
                        <span className="ml-2 text-gray-500">
                            {formattedTime}
                        </span>
                    )}
                </div>

                <div
                    className={`rounded-2xl px-4 py-3 text-sm ${
                        isMine
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-900"
                    }`}
                >
                    {content}
                </div>
            </div>
        </div>
    );
}