import {
    Ban,
    CircleAlert,
    MessageCircle,
    MoreVertical,
    Phone,
} from "lucide-react";

import {
    forwardRef,
    useEffect,
    useRef,
    useState,
} from "react";

import { createPortal } from "react-dom";

import conducteurPlaceholder
    from "../../assets/conducteur.png";

import passagerPlaceholder
    from "../../assets/passager.png";

export type UserTripRole =
    | "DRIVER"
    | "PASSENGER";

interface UserCardProps {
    userId: number;

    name: string;

    pictureUrl?: string | null;

    rating?: number;

    tripRole?: UserTripRole;

    isCurrentUser?: boolean;

    onPublicProfile?: () => void;

    /*
     * Bulle principale :
     *
     * TripDetails -> TripMessage
     * Profile     -> PrivateMessage
     */
    onMessage?: () => void;

    /*
     * Menu ⋮
     */
    onContact?: () => void;

    onPrivateMessage?: () => void;

    onCall?: () => void;

    onReport?: () => void;

    onBlacklist?: () => void;

    size?: "large" | "small";
}

interface MenuPosition {
    top: number;
    right: number;
}

export default function UserCard({
    name,
    pictureUrl,
    rating = 0,
    tripRole,
    isCurrentUser = false,
    onPublicProfile,
    onMessage,
    onContact,
    onPrivateMessage,
    onCall,
    onReport,
    onBlacklist,
    size = "large",
}: UserCardProps) {
    const [
        menuOpen,
        setMenuOpen,
    ] =
        useState(false);

    const [
        menuPosition,
        setMenuPosition,
    ] =
        useState<MenuPosition>({
            top: 0,
            right: 0,
        });

    const menuButtonRef =
        useRef<HTMLButtonElement | null>(
            null,
        );

    const menuRef =
        useRef<HTMLDivElement | null>(
            null,
        );

    const placeholder =
        tripRole === "DRIVER"
            ? conducteurPlaceholder
            : passagerPlaceholder;

    /*
     * Si pictureUrl existe en BDD mais
     * que le fichier a disparu, on passe
     * automatiquement au placeholder.
     */
    const [
        imageSrc,
        setImageSrc,
    ] =
        useState(
            pictureUrl
            || placeholder,
        );

    useEffect(() => {
        setImageSrc(
            pictureUrl
            || placeholder,
        );
    }, [
        pictureUrl,
        placeholder,
    ]);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const closeMenu = (
            event: MouseEvent,
        ) => {
            const target =
                event.target as Node;

            if (
                menuRef.current
                    ?.contains(target)
                || menuButtonRef.current
                    ?.contains(target)
            ) {
                return;
            }

            setMenuOpen(false);
        };

        const closeOnEscape = (
            event: KeyboardEvent,
        ) => {
            if (
                event.key
                === "Escape"
            ) {
                setMenuOpen(false);
            }
        };

        document.addEventListener(
            "mousedown",
            closeMenu,
        );

        document.addEventListener(
            "keydown",
            closeOnEscape,
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                closeMenu,
            );

            document.removeEventListener(
                "keydown",
                closeOnEscape,
            );
        };
    }, [menuOpen]);

    const openMenu =
        () => {
            if (
                !menuButtonRef.current
            ) {
                return;
            }

            const rect =
                menuButtonRef.current
                    .getBoundingClientRect();

            /*
             * Menu fixé au viewport :
             * il ne peut plus être coupé
             * par un overflow d'un parent.
             */
            setMenuPosition({
                top:
                    rect.bottom
                    + 6,

                right:
                    window.innerWidth
                    - rect.right,
            });

            setMenuOpen(
                (
                    current,
                ) =>
                    !current,
            );
        };

    const avatarSize =
        size === "large"
            ? "h-20 w-20"
            : "h-10 w-10";

    const nameSize =
        size === "large"
            ? "text-2xl"
            : "text-lg";

    return (
        <article
            className="
                flex
                w-full
                items-center
                gap-3
            "
        >
            {/* IDENTITE */}
            <button
                type="button"
                disabled={
                    !onPublicProfile
                }
                onClick={
                    onPublicProfile
                }
                className="
                    flex
                    min-w-0
                    flex-1
                    items-center
                    gap-3
                    text-left
                "
            >
                <img
                    src={
                        imageSrc
                    }
                    alt={
                        `Profil de ${name}`
                    }
                    onError={() =>
                        setImageSrc(
                            placeholder,
                        )
                    }
                    className={`
                        ${avatarSize}
                        shrink-0
                        rounded-full
                        object-cover
                    `}
                />

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <p
                        className={`
                            ${nameSize}
                            truncate
                            font-semibold
                            text-zinc-700
                        `}
                    >
                        {name}
                    </p>

                    <Rating
                        value={
                            rating
                        }
                    />
                </div>
            </button>

            {/* ACTIONS */}
            {!isCurrentUser && (
                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        text-zinc-500
                    "
                >
                    {/* MESSAGE */}
                    <IconButton
                        label="Envoyer un message"
                        disabled={
                            !onMessage
                        }
                        onClick={
                            onMessage
                        }
                    >
                        <MessageCircle
                            size={18}
                            fill="currentColor"
                        />
                    </IconButton>

                    {/* SIGNALER */}
                    <IconButton
                        label="Signaler l'utilisateur"
                        disabled={
                            !onReport
                        }
                        onClick={
                            onReport
                        }
                    >
                        <CircleAlert
                            size={18}
                        />
                    </IconButton>

                    {/* BLACKLIST */}
                    <IconButton
                        label="Bloquer l'utilisateur"
                        disabled={
                            !onBlacklist
                        }
                        onClick={
                            onBlacklist
                        }
                    >
                        <Ban
                            size={18}
                        />
                    </IconButton>

                    {/* MENU ⋮ */}
                    <button
                        ref={
                            menuButtonRef
                        }
                        type="button"
                        onClick={
                            openMenu
                        }
                        aria-label="Plus d'options"
                        aria-expanded={
                            menuOpen
                        }
                        title="Plus d'options"
                        className="
                            rounded
                            p-0.5
                            transition-colors
                            hover:bg-zinc-100
                            hover:text-zinc-900
                        "
                    >
                        <MoreVertical
                            size={19}
                        />
                    </button>
                </div>
            )}

            {menuOpen
                && createPortal(
                    <UserMenu
                        ref={
                            menuRef
                        }
                        position={
                            menuPosition
                        }
                        onContact={() => {
                            setMenuOpen(
                                false,
                            );

                            if (
                                onContact
                            ) {
                                onContact();
                            } else {
                                onMessage?.();
                            }
                        }}
                        onPrivateMessage={() => {
                            setMenuOpen(
                                false,
                            );

                            onPrivateMessage?.();
                        }}
                        onCall={() => {
                            setMenuOpen(
                                false,
                            );

                            onCall?.();
                        }}
                        canContact={
                            Boolean(
                                onContact
                                || onMessage,
                            )
                        }
                        canPrivateMessage={
                            Boolean(
                                onPrivateMessage,
                            )
                        }
                        canCall={
                            Boolean(
                                onCall,
                            )
                        }
                    />,
                    document.body,
                )}
        </article>
    );
}

/* =========================================================
 * MENU
 * ========================================================= */


interface UserMenuProps {
    position: MenuPosition;

    onContact: () => void;

    onPrivateMessage:
        () => void;

    onCall: () => void;

    canContact: boolean;

    canPrivateMessage: boolean;

    canCall: boolean;
}

const UserMenu =
    forwardRef<
        HTMLDivElement,
        UserMenuProps
    >(
        function UserMenu(
            {
                position,
                onContact,
                onPrivateMessage,
                onCall,
                canContact,
                canPrivateMessage,
                canCall,
            },
            ref,
        ) {
            return (
                <div
                    ref={
                        ref
                    }
                    style={{
                        top:
                            position.top,

                        right:
                            position.right,
                    }}
                    className="
                        fixed
                        z-[9999]
                        w-48
                        overflow-hidden
                        rounded-lg
                        border
                        border-zinc-200
                        bg-white
                        py-1
                        shadow-xl
                    "
                >
                    <MenuButton
                        icon={
                            <MessageCircle
                                size={16}
                            />
                        }
                        label="Contacter"
                        disabled={
                            !canContact
                        }
                        onClick={
                            onContact
                        }
                    />

                    <MenuButton
                        icon={
                            <MessageCircle
                                size={16}
                            />
                        }
                        label="Message privé"
                        disabled={
                            !canPrivateMessage
                        }
                        onClick={
                            onPrivateMessage
                        }
                    />

                    <MenuButton
                        icon={
                            <Phone
                                size={16}
                            />
                        }
                        label="Téléphoner"
                        disabled={
                            !canCall
                        }
                        onClick={
                            onCall
                        }
                    />
                </div>
            );
        },
    );

/* =========================================================
 * BUTTONS
 * ========================================================= */

function IconButton({
    label,
    onClick,
    disabled = false,
    children,
}: {
    label: string;

    onClick?: () => void;

    disabled?: boolean;

    children:
        React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={
                label
            }
            title={
                label
            }
            disabled={
                disabled
            }
            onClick={
                onClick
            }
            className="
                rounded
                p-0.5
                transition-colors
                hover:bg-zinc-100
                hover:text-zinc-900
                disabled:opacity-40
            "
        >
            {children}
        </button>
    );
}

function MenuButton({
    icon,
    label,
    onClick,
    disabled = false,
}: {
    icon: React.ReactNode;

    label: string;

    onClick: () => void;

    disabled?: boolean;
}) {
    return (
        <button
            type="button"
            disabled={
                disabled
            }
            onClick={
                onClick
            }
            className="
                flex
                w-full
                items-center
                gap-3
                px-3
                py-2.5
                text-left
                text-sm
                text-zinc-700
                transition-colors
                hover:bg-zinc-100
                disabled:cursor-not-allowed
                disabled:opacity-40
            "
        >
            {icon}

            <span>
                {label}
            </span>
        </button>
    );
}

/* =========================================================
 * RATING
 * ========================================================= */

function Rating({
    value,
}: {
    value: number;
}) {
    const rounded =
        Math.max(
            0,
            Math.min(
                5,
                Math.round(
                    value,
                ),
            ),
        );

    return (
        <div
            className="
                flex
                text-xs
                text-amber-400
            "
            aria-label={
                `Note ${value} sur 5`
            }
        >
            {"★".repeat(
                rounded,
            )}

            {"☆".repeat(
                5 - rounded,
            )}
        </div>
    );
}