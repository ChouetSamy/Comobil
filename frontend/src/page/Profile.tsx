import {
    Ban,
    Cigarette,
    Dog,
    Music,
    Pencil,
    Phone,
    Star,
    Users,
    Venus,
} from "lucide-react";

import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router-dom";

import UserCard from "../component/user/UserCard";
import VehicleCard from "../component/vehicle/VehicleCard";

const API_URL =
    import.meta.env.VITE_API_URL
    ?? "http://localhost:8080";

/* =========================================================
 * TYPES
 * ========================================================= */

interface CurrentProfile {
    id: number;
}

interface ProfileData {
    user: {
        id: number;
        firstName: string;
        lastName: string;
        phone: string | null;
        gender: string | null;
    };

    userInfo: {
        id: number;
        pictureUrl: string | null;
        bio: string | null;
        acceptCall: boolean;
        averageRating: number | null;
    } | null;

    vehicle: {
        id: number;
        pictureUrl: string | null;
        seat: number | null;
        hasAc: boolean | null;
        consumptionLiterPer100km: number | null;
        vehicleState: string | null;
        description: string | null;
    } | null;

    preferences: Array<{
        id: number;
        active: boolean;

        preference: {
            id: number | null;
            description: string | null;
        };
    }>;

    reviews: Array<{
        id: number;
        comment: string | null;
        createdAt: string | null;

        author: {
            id: number;
            firstName: string;
            lastName: string;
            pictureUrl: string | null;
            averageRating: number | null;
        } | null;
    }>;
}

/* =========================================================
 * PAGE
 * ========================================================= */

export default function Profile() {
    const { userId } =
        useParams();

    const navigate =
        useNavigate();

    const [searchParams] =
        useSearchParams();

    const tripId =
        searchParams.get("tripId");

    const token =
        localStorage.getItem("token");

    const [
        currentUserId,
        setCurrentUserId,
    ] =
        useState<number | null>(null);

    const [
        profile,
        setProfile,
    ] =
        useState<ProfileData | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    /* =====================================================
     * LOAD PROFILE
     * ===================================================== */

    useEffect(() => {
        const loadProfile =
            async () => {
                if (!token) {
                    navigate("/login");
                    return;
                }

                setLoading(true);
                setError("");

                try {
                    const currentResponse =
                        await fetch(
                            `${API_URL}/profile`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    Accept:
                                        "application/json",
                                },
                            },
                        );

                    if (!currentResponse.ok) {
                        throw new Error(
                            "Impossible de charger votre profil.",
                        );
                    }

                    const currentProfile:
                        CurrentProfile =
                        await currentResponse.json();

                    setCurrentUserId(
                        currentProfile.id,
                    );

                    const targetUserId =
                        userId
                            ? Number(userId)
                            : currentProfile.id;

                    if (
                        Number.isNaN(
                            targetUserId,
                        )
                    ) {
                        throw new Error(
                            "Utilisateur introuvable.",
                        );
                    }

                    const response =
                        await fetch(
                            `${API_URL}/api/public-profile/${targetUserId}`,
                            {
                                headers: {
                                    Authorization:
                                        `Bearer ${token}`,

                                    Accept:
                                        "application/json",
                                },
                            },
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Impossible de charger le profil.",
                        );
                    }

                    const data:
                        ProfileData =
                        await response.json();

                    setProfile(data);
                } catch (
                    caughtError
                ) {
                    setError(
                        caughtError
                            instanceof Error
                            ? caughtError.message
                            : "Une erreur est survenue.",
                    );
                } finally {
                    setLoading(false);
                }
            };

        void loadProfile();
    }, [
        userId,
        token,
        navigate,
    ]);

    /* =====================================================
     * STATES
     * ===================================================== */

    if (loading) {
        return (
            <main
                className="
                    p-6
                    text-center
                    text-zinc-500
                "
            >
                Chargement...
            </main>
        );
    }

    if (
        error
        || !profile
    ) {
        return (
            <main
                className="
                    p-6
                    text-center
                    text-red-600
                "
            >
                {error
                    || "Profil introuvable."}
            </main>
        );
    }

    const info =
        profile.userInfo;

    const vehicle =
        profile.vehicle;

    const isOwnProfile =
        currentUserId
        === profile.user.id;

    const activePreferences =
        profile.preferences.filter(
            (
                preference,
            ) =>
                preference.active,
        );

    /* =====================================================
     * ACTIONS USER
     * ===================================================== */

    const openPrivateMessage =
        () => {
            if (isOwnProfile) {
                return;
            }

            if (tripId) {
                navigate(
                    `/trips/${tripId}/messages/${profile.user.id}`,
                );

                return;
            }

            /*
             * Hors contexte trajet :
             * retour à l'historique de messagerie.
             */
            navigate("/messages");
        };

    const reportUser =
        () => {
            if (isOwnProfile) {
                return;
            }

            window.alert(
                `Signalement utilisateur #${profile.user.id} non encore branché.`,
            );
        };

    const blacklistUser =
        () => {
            if (isOwnProfile) {
                return;
            }

            window.alert(
                `Blacklist utilisateur #${profile.user.id} non encore branchée.`,
            );
        };

    const callUser =
        () => {
            if (
                !profile.user.phone
            ) {
                return;
            }

            window.location.href =
                `tel:${profile.user.phone}`;
        };

    /* =====================================================
     * VIEW
     * ===================================================== */

    return (
        <main
            className="
                mx-auto
                w-full
                max-w-[520px]
                bg-white
                px-3
                pb-24
                pt-4
            "
        >
            {/* =====================================
                USER CARD
            ====================================== */}

            <section
                className="
                    px-2
                "
            >
                <UserCard
                    userId={
                        profile.user.id
                    }

                    name={
                        [
                            profile
                                .user
                                .firstName,

                            profile
                                .user
                                .lastName,
                        ]
                            .filter(Boolean)
                            .join(" ")
                    }

                    pictureUrl={
                        resolveImageUrl(
                            info?.pictureUrl,
                        )
                    }

                    rating={
                        info
                            ?.averageRating
                        ?? 0
                    }

                    isCurrentUser={
                        isOwnProfile
                    }

                    /*
                     * Sur Profile :
                     * bulle principale =
                     * message privé.
                     */
                    onMessage={
                        openPrivateMessage
                    }

                    onContact={
                        openPrivateMessage
                    }

                    onPrivateMessage={
                        openPrivateMessage
                    }

                    onReport={
                        reportUser
                    }

                    onBlacklist={
                        blacklistUser
                    }

                    onCall={
                        profile.user.phone
                            && (
                                isOwnProfile
                                || info
                                    ?.acceptCall
                            )
                            ? callUser
                            : undefined
                    }

                    size="large"
                />

                {/* ===============================
                    MON PROFIL
                ================================ */}

                {isOwnProfile && (
                    <div
                        className="
                            mt-3
                            flex
                        "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/profile/edit",
                                )
                            }
                            className="
                                flex
                                items-center
                                gap-2
                                rounded-md
                                bg-sky-600
                                px-4
                                py-2
                                text-xs
                                font-medium
                                text-white
                            "
                        >
                            <Pencil
                                size={14}
                            />

                            Modifier mon profil
                        </button>
                    </div>
                )}
            </section>

            {/* =====================================
                TÉLÉPHONE
            ====================================== */}

            {profile.user.phone
                && (
                    isOwnProfile
                    || info
                        ?.acceptCall
                ) && (
                <section
                    className="
                        mt-3
                        flex
                        items-center
                        gap-3
                        rounded-xl
                        border
                        border-zinc-200
                        bg-white
                        p-4
                    "
                >
                    <Phone
                        size={24}
                        className="
                            text-sky-600
                        "
                    />

                    <span
                        className="
                            font-semibold
                            text-zinc-700
                        "
                    >
                        {
                            profile
                                .user
                                .phone
                        }
                    </span>
                </section>
            )}

            {/* =====================================
                BIO
            ====================================== */}

            <Card
                title="Biographie"
            >
                <p
                    className="
                        whitespace-pre-line
                        text-sm
                        text-zinc-500
                    "
                >
                    {info?.bio
                        || "Aucune biographie renseignée."}
                </p>
            </Card>

            {/* =====================================
                VEHICULE
            ====================================== */}

            {vehicle && (
                <VehicleCard
                    vehicle={
                        vehicle
                    }
                />
            )}

            {/* =====================================
                PREFERENCES
            ====================================== */}

            <Card
                title="Préférences de voyage"
            >
                {activePreferences.length
                    === 0 ? (
                    <p
                        className="
                            text-sm
                            text-zinc-500
                        "
                    >
                        Aucune préférence renseignée.
                    </p>
                ) : (
                    <div
                        className="
                            space-y-1
                        "
                    >
                        {activePreferences.map(
                            (
                                item,
                            ) => (
                                <PreferenceRow
                                    key={
                                        item.id
                                    }
                                    description={
                                        item
                                            .preference
                                            .description
                                        ?? ""
                                    }
                                />
                            ),
                        )}
                    </div>
                )}
            </Card>

            {/* =====================================
                AVIS
            ====================================== */}

            <section
                className="
                    mt-4
                "
            >
                <h2
                    className="
                        mb-2
                        text-lg
                        font-bold
                        text-zinc-700
                    "
                >
                    Avis
                </h2>

                {profile.reviews.length
                    === 0 ? (
                    <div
                        className="
                            rounded-xl
                            border
                            border-zinc-200
                            bg-white
                            p-4
                            text-sm
                            text-zinc-500
                        "
                    >
                        Aucun avis pour le moment.
                    </div>
                ) : (
                    <div
                        className="
                            space-y-2
                        "
                    >
                        {profile.reviews.map(
                            (
                                review,
                            ) => (
                                <ReviewCard
                                    key={
                                        review.id
                                    }
                                    review={
                                        review
                                    }
                                />
                            ),
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

/* =========================================================
 * CARD
 * ========================================================= */

function Card({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <section
            className="
                mt-3
                rounded-xl
                border
                border-zinc-300
                bg-white
                p-4
            "
        >
            <h2
                className="
                    mb-2
                    text-lg
                    font-bold
                    text-zinc-700
                "
            >
                {title}
            </h2>

            {children}
        </section>
    );
}

/* =========================================================
 * PREFERENCES
 * ========================================================= */

function PreferenceRow({
    description,
}: {
    description: string;
}) {
    const normalized =
        description.toLowerCase();

    let icon =
        <Users size={18} />;

    const label =
        translatePreference(
            description,
        );

    if (
        normalized.includes(
            "women",
        )
        || normalized.includes(
            "femme",
        )
    ) {
        icon =
            <Venus size={18} />;
    } else if (
        normalized.includes(
            "smok",
        )
        || normalized.includes(
            "fumeur",
        )
    ) {
        icon =
            <Cigarette
                size={18}
            />;
    } else if (
        normalized.includes(
            "animal",
        )
    ) {
        icon =
            <Dog size={18} />;
    } else if (
        normalized.includes(
            "music",
        )
        || normalized.includes(
            "musique",
        )
    ) {
        icon =
            <Music size={18} />;
    } else if (
        normalized.includes(
            "talk",
        )
        || normalized.includes(
            "discussion",
        )
    ) {
        icon =
            <Ban size={18} />;
    }

    return (
        <div
            className="
                flex
                items-center
                gap-2
                rounded-lg
                bg-zinc-50
                px-2
                py-2
                text-sm
                text-zinc-500
            "
        >
            <span
                className="
                    text-sky-500
                "
            >
                {icon}
            </span>

            {label}
        </div>
    );
}

/* =========================================================
 * REVIEW
 * ========================================================= */

function ReviewCard({
    review,
}: {
    review:
        ProfileData[
            "reviews"
        ][number];
}) {
    const author =
        review.author;

    return (
        <article
            className="
                rounded-xl
                border
                border-zinc-200
                bg-white
                p-4
            "
        >
            <div
                className="
                    flex
                    items-start
                    gap-3
                "
            >
                <ReviewAvatar
                    src={
                        author
                            ?.pictureUrl
                    }
                />

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <strong
                        className="
                            block
                            text-sm
                            text-zinc-700
                        "
                    >
                        {
                            author
                                ?.firstName
                            ?? "Utilisateur"
                        }
                    </strong>

                    <ReviewRating
                        rating={
                            author
                                ?.averageRating
                            ?? 0
                        }
                    />

                    <p
                        className="
                            mt-2
                            whitespace-pre-line
                            text-sm
                            text-zinc-500
                        "
                    >
                        {review.comment
                            || "Aucun commentaire."}
                    </p>
                </div>
            </div>
        </article>
    );
}

function ReviewAvatar({
    src,
}: {
    src?: string | null;
}) {
    if (!src) {
        return (
            <div
                className="
                    h-10
                    w-10
                    shrink-0
                    rounded-full
                    bg-zinc-200
                "
            />
        );
    }

    return (
        <img
            src={
                resolveImageUrl(
                    src,
                )
            }
            alt=""
            className="
                h-10
                w-10
                shrink-0
                rounded-full
                object-cover
            "
        />
    );
}

function ReviewRating({
    rating,
}: {
    rating: number;
}) {
    const rounded =
        Math.round(
            rating,
        );

    return (
        <div
            className="
                flex
            "
        >
            {[1, 2, 3, 4, 5].map(
                (
                    star,
                ) => (
                    <Star
                        key={
                            star
                        }
                        size={12}
                        fill="currentColor"
                        className={
                            star
                                <= rounded
                                ? "text-amber-400"
                                : "text-zinc-300"
                        }
                    />
                ),
            )}
        </div>
    );
}

/* =========================================================
 * HELPERS
 * ========================================================= */

function resolveImageUrl(
    url?:
        string
        | null,
): string | undefined {
    if (!url) {
        return undefined;
    }

    if (
        url.startsWith(
            "http://",
        )
        || url.startsWith(
            "https://",
        )
        || url.startsWith(
            "blob:",
        )
        || url.startsWith(
            "data:",
        )
    ) {
        return url;
    }

    return `${API_URL}${url}`;
}

function translatePreference(
    description: string,
): string {
    const key =
        description
            .trim()
            .toLowerCase()
            .replaceAll(
                " ",
                "_",
            );

    switch (key) {
        case "women_only":
            return "Femmes uniquement";

        case "smoking":
            return "Fumeur autorisé";

        case "animals":
        case "animals_allowed":
            return "Animaux autorisés";

        case "music":
        case "music_allowed":
            return "Musique autorisée";

        case "no_music":
            return "Pas de musique";

        case "talk":
        case "talk_allowed":
            return "Discussion autorisée";

        case "no_talk":
            return "Pas de discussion";

        case "seek_conductor":
            return "Recherche un conducteur";

        default:
            return description;
    }
}