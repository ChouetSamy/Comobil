import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Camera, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL =
    import.meta.env.VITE_API_URL ?? "http://localhost:8080";

interface Profile {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: string;
}

interface UserInfo {
    "@id": string;
    id: number;
    pictureUrl?: string | null;
    bio?: string | null;
    fleet?: string | null;
}

interface Preference {
    "@id": string;
    id: number;
    description: string;
}

interface UserPreference {
    "@id": string;
    id: number;
    userInfo: string;
    preference: string;
    active: boolean;
}

interface Vehicle {
    "@id": string;
    id: number;
    fleet: string;
    pictureUrl?: string | null;
    ac?: boolean;
    hasAc?: boolean;
    consumptionLiterPer100km?: number | null;
    seat?: number;
    vehicleState?: string;
    description?: string | null;
}

interface CollectionResponse<T> {
    member?: T[];
    "hydra:member"?: T[];
}

interface FormState {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    gender: string;
    bio: string;

    password: string;
    passwordConfirmation: string;

    hasAc: boolean;
    consumption: string;
    seat: string;
    vehicleState: string;
    vehicleDescription: string;
}

const initialForm: FormState = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    gender: "",
    bio: "",

    password: "",
    passwordConfirmation: "",

    hasAc: false,
    consumption: "",
    seat: "",
    vehicleState: "",
    vehicleDescription: "",
};

const preferenceLabels: Record<string, string> = {
    women_only: "Femmes uniquement",
    seek_conductor: "Cherche un conducteur",

    smoking: "Fumeur",
    non_smoking: "Non-fumeur",
    smoker_allowed: "Fumeur autorisé",

    animals_allowed: "Animaux autorisés",

    music_allowed: "Musique autorisée",
    no_music: "Pas de musique",

    discussion_allowed: "Discussion autorisée",
    talk_allowed: "Discussion autorisée",
    no_talk: "Pas de discussion",
};

const normalizePreference = (description: string) =>
    description
        .trim()
        .toLowerCase()
        .replaceAll(" ", "_");

const getPreferenceLabel = (description: string) => {
    const key = normalizePreference(description);

    return (
        preferenceLabels[key]
        ?? key.replaceAll("_", " ")
    );
};

const formatPhone = (value: string) =>
    value
        .replace(/\D/g, "")
        .slice(0, 10)
        .replace(/(\d{2})(?=\d)/g, "$1 ");

const resolveImageUrl = (
    url?: string | null,
): string => {
    if (!url) {
        return "";
    }

    if (
        url.startsWith("http://")
        || url.startsWith("https://")
        || url.startsWith("blob:")
        || url.startsWith("data:")
    ) {
        return url;
    }

    return `${API_URL}${url}`;
};

export default function EditProfile() {
    const navigate = useNavigate();

    const token =
        localStorage.getItem("token");

    const authHeaders = {
        Authorization: `Bearer ${token}`,
        Accept: "application/ld+json",
    };

    const [form, setForm] =
        useState<FormState>(initialForm);

    const [originalEmail, setOriginalEmail] =
        useState("");

    const [preferences, setPreferences] =
        useState<Preference[]>([]);

    const [userPreferences, setUserPreferences] =
        useState<UserPreference[]>([]);

    const [
        preferenceValues,
        setPreferenceValues,
    ] = useState<Record<number, boolean>>({});

    const [vehicle, setVehicle] =
        useState<Vehicle | null>(null);

    /*
     * Profile picture
     */
    const [
        profilePictureUrl,
        setProfilePictureUrl,
    ] = useState("");

    const [
        profilePictureFile,
        setProfilePictureFile,
    ] = useState<File | null>(null);

    const [
        profilePreview,
        setProfilePreview,
    ] = useState("");

    /*
     * Vehicle picture
     */
    const [
        vehiclePictureUrl,
        setVehiclePictureUrl,
    ] = useState("");

    const [
        vehiclePictureFile,
        setVehiclePictureFile,
    ] = useState<File | null>(null);

    const [
        vehiclePreview,
        setVehiclePreview,
    ] = useState("");

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState<string | null>(null);

    const [message, setMessage] =
        useState("");

    const [error, setError] =
        useState("");

    const updateField =
        <K extends keyof FormState>(
            key: K,
            value: FormState[K],
        ) => {
            setForm((current) => ({
                ...current,
                [key]: value,
            }));
        };

    const readCollection =
        async <T,>(
            response: Response,
        ): Promise<T[]> => {
            if (!response.ok) {
                return [];
            }

            const data: CollectionResponse<T> =
                await response.json();

            return (
                data.member
                ?? data["hydra:member"]
                ?? []
            );
        };

    const loadProfile = async () => {
        setLoading(true);
        setError("");

        try {
            const [
                profileResponse,
                userInfoResponse,
                preferenceResponse,
                userPreferenceResponse,
                vehicleResponse,
            ] = await Promise.all([
                fetch(
                    `${API_URL}/profile`,
                    {
                        headers:
                            authHeaders,
                    },
                ),

                fetch(
                    `${API_URL}/api/user_infos`,
                    {
                        headers:
                            authHeaders,
                    },
                ),

                fetch(
                    `${API_URL}/api/preferences`,
                    {
                        headers:
                            authHeaders,
                    },
                ),

                fetch(
                    `${API_URL}/api/user_preferences`,
                    {
                        headers:
                            authHeaders,
                    },
                ),

                fetch(
                    `${API_URL}/api/vehicles`,
                    {
                        headers:
                            authHeaders,
                    },
                ),
            ]);

            if (!profileResponse.ok) {
                throw new Error(
                    "Impossible de charger le profil.",
                );
            }

            const profile: Profile =
                await profileResponse.json();

            const userInfos =
                await readCollection<UserInfo>(
                    userInfoResponse,
                );

            const availablePreferences =
                await readCollection<Preference>(
                    preferenceResponse,
                );

            const allUserPreferences =
                await readCollection<UserPreference>(
                    userPreferenceResponse,
                );

            const vehicles =
                await readCollection<Vehicle>(
                    vehicleResponse,
                );

            const userInfo =
                userInfos[0] ?? null;

            const currentPreferences =
                userInfo
                    ? allUserPreferences.filter(
                        (item) =>
                            item.userInfo
                            === userInfo["@id"],
                    )
                    : [];

            const currentVehicle =
                userInfo?.fleet
                    ? vehicles.find(
                        (item) =>
                            item.fleet
                            === userInfo.fleet,
                    ) ?? null
                    : null;

            const values:
                Record<number, boolean> = {};

            for (
                const preference
                of availablePreferences
            ) {
                const existing =
                    currentPreferences.find(
                        (item) =>
                            item.preference
                            === preference["@id"],
                    );

                values[preference.id] =
                    existing?.active
                    ?? false;
            }

            setOriginalEmail(
                profile.email,
            );

            setPreferences(
                availablePreferences,
            );

            setUserPreferences(
                currentPreferences,
            );

            setPreferenceValues(
                values,
            );

            setVehicle(
                currentVehicle,
            );

            /*
             * Keep the relative URL for API persistence,
             * but use an absolute URL for the browser.
             */
            const storedProfilePicture =
                userInfo?.pictureUrl ?? "";

            setProfilePictureUrl(
                storedProfilePicture,
            );

            setProfilePreview(
                resolveImageUrl(
                    storedProfilePicture,
                ),
            );

            const storedVehiclePicture =
                currentVehicle?.pictureUrl ?? "";

            setVehiclePictureUrl(
                storedVehiclePicture,
            );

            setVehiclePreview(
                resolveImageUrl(
                    storedVehiclePicture,
                ),
            );

            setForm({
                firstName:
                    profile.firstName
                    ?? "",

                lastName:
                    profile.lastName
                    ?? "",

                email:
                    profile.email
                    ?? "",

                phone:
                    formatPhone(
                        profile.phone
                        ?? "",
                    ),

                gender:
                    profile.gender
                    ?? "",

                bio:
                    userInfo?.bio
                    ?? "",

                password: "",

                passwordConfirmation:
                    "",

                hasAc:
                    currentVehicle?.ac
                    ?? currentVehicle
                        ?.hasAc
                    ?? false,

                consumption:
                    currentVehicle
                        ?.consumptionLiterPer100km
                        ?.toString()
                    ?? "",

                seat:
                    currentVehicle
                        ?.seat
                        ?.toString()
                    ?? "",

                vehicleState:
                    currentVehicle
                        ?.vehicleState
                    ?? "",

                vehicleDescription:
                    currentVehicle
                        ?.description
                    ?? "",
            });
        } catch (caughtError) {
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

    useEffect(() => {
        void loadProfile();
    }, []);

    const selectImage = (
        file: File | undefined,
        setPreview:
            (value: string) => void,
    ) => {
        if (!file) {
            return;
        }

        const objectUrl =
            URL.createObjectURL(file);

        setPreview(objectUrl);
    };

    /*
     * =========================
     * PROFILE PICTURE UPLOAD
     * =========================
     */
    const uploadProfilePicture =
        async (): Promise<
            string | null
        > => {
            if (!profilePictureFile) {
                return (
                    profilePictureUrl
                    || null
                );
            }

            const formData =
                new FormData();

            formData.append(
                "picture",
                profilePictureFile,
            );

            const response =
                await fetch(
                    `${API_URL}/profile/picture`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },

                        body:
                            formData,
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Impossible d'envoyer la photo de profil.",
                );
            }

            const result: {
                pictureUrl: string;
            } = await response.json();

            setProfilePictureUrl(
                result.pictureUrl,
            );

            setProfilePreview(
                resolveImageUrl(
                    result.pictureUrl,
                ),
            );

            setProfilePictureFile(
                null,
            );

            return result.pictureUrl;
        };

    /*
     * =========================
     * VEHICLE PICTURE UPLOAD
     * =========================
     */
    const uploadVehiclePicture = async (
    vehicleId: number,
): Promise<string | null> => {
    if (!vehiclePictureFile) {
        return vehiclePictureUrl || null;
    }

    const formData = new FormData();

    formData.append(
        "picture",
        vehiclePictureFile,
    );

    const response = await fetch(
        `${API_URL}/api/vehicles/${vehicleId}/picture`,
        {
            method: "POST",

            headers: {
                ...authHeaders,
            },

            body: formData,
        },
    );

    if (!response.ok) {
        const text = await response.text();

        console.error(
            "Vehicle picture upload:",
            response.status,
            text,
        );

        throw new Error(
            "Impossible d'envoyer la photo du véhicule.",
        );
    }

    const result: {
        pictureUrl: string;
    } = await response.json();

    setVehiclePictureUrl(
        result.pictureUrl,
    );

    setVehiclePreview(
        resolveImageUrl(
            result.pictureUrl,
        ),
    );

    setVehiclePictureFile(null);

    return result.pictureUrl;
};

    /*
     * =========================
     * SAVE PROFILE
     * =========================
     */
    const saveProfile = async () => {
        setError("");
        setMessage("");

        if (
            form.password
            && form.password
            !== form.passwordConfirmation
        ) {
            setError(
                "Les mots de passe ne correspondent pas.",
            );

            return;
        }

        if (
            form.password
            && form.password.length < 8
        ) {
            setError(
                "Le mot de passe doit contenir au moins 8 caractères.",
            );

            return;
        }

        setSaving("profile");

        try {
            /*
             * Upload first so that we immediately
             * get the persisted URL.
             */
            const pictureUrl =
                await uploadProfilePicture();

            /*
             * UserInfo
             */
            const infoResponse = await fetch(
                `${API_URL}/profile`,
                {
                    method: "POST",

                    headers: {
                        ...authHeaders,

                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        bio: form.bio || null,

                        picture_url: pictureUrl,
                    }),
                },
            );

            if (!infoResponse.ok) {
                throw new Error(
                    "Impossible de modifier les informations du profil.",
                );
            }

            /*
             * User
             */
            const payload:
                Record<string, string> =
            {
                firstName:
                    form.firstName
                        .trim(),

                lastName:
                    form.lastName
                        .trim(),

                email:
                    form.email
                        .trim(),

                phone:
                    form.phone
                        .replace(
                            /\s/g,
                            "",
                        ),

                gender:
                    form.gender,
            };

            if (form.password) {
                payload.password =
                    form.password;
            }

            const response =
                await fetch(
                    `${API_URL}/profile`,
                    {
                        method: "PATCH",

                        headers: {
                            ...authHeaders,

                            "Content-Type":
                                "application/json",
                        },

                        body:
                            JSON.stringify(
                                payload,
                            ),
                    },
                );

            if (!response.ok) {
                const data =
                    await response.json();

                throw new Error(
                    data.error
                    ?? data.errors?.[0]
                    ?? "Impossible de modifier le profil.",
                );
            }

            /*
             * JWT username = email.
             * A new login is required
             * when the email changes.
             */
            if (
                form.email.trim()
                !== originalEmail
            ) {
                localStorage.removeItem(
                    "token",
                );

                navigate(
                    "/login",
                );

                return;
            }

            setForm(
                (current) => ({
                    ...current,

                    password: "",

                    passwordConfirmation:
                        "",
                }),
            );

            await loadProfile();

            setMessage(
                "Profil mis à jour.",
            );
        } catch (caughtError) {
            setError(
                caughtError
                    instanceof Error
                    ? caughtError.message
                    : "Une erreur est survenue.",
            );
        } finally {
            setSaving(null);
        }
    };

    /*
     * =========================
     * SAVE PREFERENCES
     * =========================
     */
    const savePreferences =
        async () => {
            setError("");
            setMessage("");
            setSaving(
                "preferences",
            );

            try {
                for (
                    const preference
                    of preferences
                ) {
                    const key =
                        normalizePreference(
                            preference.description,
                        );

                    /*
                     * Front UX protection.
                     * Backend protection
                     * already exists too.
                     */
                    if (
                        form.gender
                        !== "FEMALE"
                        && key
                        === "women_only"
                    ) {
                        continue;
                    }

                    const active =
                        preferenceValues[
                        preference.id
                        ] ?? false;

                    const existing =
                        userPreferences.find(
                            (item) =>
                                item.preference
                                ===
                                preference[
                                "@id"
                                ],
                        );

                    /*
                     * UPDATE
                     */
                    if (existing) {
                        if (
                            existing.active
                            === active
                        ) {
                            continue;
                        }

                        const response =
                            await fetch(
                                `${API_URL}${existing["@id"]}`,
                                {
                                    method:
                                        "PATCH",

                                    headers: {
                                        ...authHeaders,

                                        "Content-Type":
                                            "application/merge-patch+json",
                                    },

                                    body:
                                        JSON.stringify({
                                            isActive:
                                                active,
                                        }),
                                },
                            );

                        if (!response.ok) {
                            throw new Error(
                                `Impossible de modifier "${getPreferenceLabel(
                                    preference.description,
                                )}".`,
                            );
                        }

                        continue;
                    }

                    /*
                     * No existing relation and
                     * preference is OFF:
                     * nothing to persist.
                     */
                    if (!active) {
                        continue;
                    }

                    /*
                     * CREATE
                     */
                    const response =
                        await fetch(
                            `${API_URL}/api/user_preferences`,
                            {
                                method:
                                    "POST",

                                headers: {
                                    ...authHeaders,

                                    "Content-Type":
                                        "application/ld+json",
                                },

                                body:
                                    JSON.stringify({
                                        preference:
                                            preference[
                                            "@id"
                                            ],

                                        isActive:
                                            true,
                                    }),
                            },
                        );

                    if (!response.ok) {
                        throw new Error(
                            `Impossible d'ajouter "${getPreferenceLabel(
                                preference.description,
                            )}".`,
                        );
                    }
                }

                await loadProfile();

                setMessage(
                    "Préférences mises à jour.",
                );
            } catch (caughtError) {
                setError(
                    caughtError
                        instanceof Error
                        ? caughtError.message
                        : "Une erreur est survenue.",
                );
            } finally {
                setSaving(null);
            }
        };

    /*
     * =========================
     * SAVE VEHICLE
     * =========================
     */
    const saveVehicle = async () => {
        setError("");
        setMessage("");

        if (
            !form.consumption
            || !form.seat
            || !form.vehicleState
            || !form
                .vehicleDescription
                .trim()
        ) {
            setError(
                "Complétez les informations obligatoires du véhicule.",
            );

            return;
        }

        setSaving("vehicle");

        try {
            const body = {
                hasAc:
                    form.hasAc,

                consumptionLiterPer100km:
                    Number(
                        form.consumption,
                    ),

                seat:
                    Number(
                        form.seat,
                    ),

                vehicleState:
                    form.vehicleState,

                description:
                    form
                        .vehicleDescription
                        .trim(),

                /*
                 * Existing persisted picture.
                 * The new file is uploaded
                 * just after the Vehicle
                 * itself is saved.
                 */
                pictureUrl:
                    vehiclePictureUrl
                    || null,
            };

            const response =
                await fetch(
                    vehicle
                        ? `${API_URL}${vehicle["@id"]}`
                        : `${API_URL}/api/vehicles`,
                    {
                        method:
                            vehicle
                                ? "PATCH"
                                : "POST",

                        headers: {
                            ...authHeaders,

                            "Content-Type":
                                vehicle
                                    ? "application/merge-patch+json"
                                    : "application/ld+json",
                        },

                        body:
                            JSON.stringify(
                                body,
                            ),
                    },
                );

            if (!response.ok) {
                throw new Error(
                    "Impossible d'enregistrer le véhicule.",
                );
            }

            /*
             * Important:
             * we need the ID even when this
             * is a newly-created vehicle.
             */
            const savedVehicle: Vehicle =
                await response.json();
            /*
             * Upload the real picture after
             * Vehicle exists in database.
             */
            await uploadVehiclePicture(
                savedVehicle.id,
            );

            await loadProfile();

            setMessage(
                vehicle
                    ? "Véhicule mis à jour."
                    : "Véhicule ajouté.",
            );
        } catch (caughtError) {
            setError(
                caughtError
                    instanceof Error
                    ? caughtError.message
                    : "Une erreur est survenue.",
            );
        } finally {
            setSaving(null);
        }
    };

    if (loading) {
        return (
            <p
                className="
                    py-10
                    text-center
                "
            >
                Chargement du profil…
            </p>
        );
    }

    return (
        <div
            className="
                space-y-4
                px-4
                py-4
                pb-24
            "
        >
            {/* PHOTO + BIOGRAPHIE */}
            <section
                className="
                    flex
                    gap-3
                "
            >
                <PicturePicker
                    id="profile-picture"
                    src={profilePreview}
                    alt="Photo de profil"
                    large
                    onChange={(file) => {
                        setProfilePictureFile(
                            file,
                        );

                        selectImage(
                            file,
                            setProfilePreview,
                        );
                    }}
                />

                <div
                    className="
                        min-w-0
                        flex-1
                        rounded-md
                        border
                        border-zinc-400
                        p-3
                    "
                >
                    <label
                        htmlFor="bio"
                        className="
                            font-semibold
                        "
                    >
                        Biographie
                    </label>

                    <textarea
                        id="bio"
                        rows={5}
                        value={
                            form.bio
                        }
                        placeholder="Décrivez-vous..."
                        onChange={
                            (event) =>
                                updateField(
                                    "bio",
                                    event
                                        .target
                                        .value,
                                )
                        }
                        className="
                            mt-2
                            w-full
                            resize-none
                            bg-transparent
                            text-sm
                            outline-none
                        "
                    />
                </div>
            </section>

            {/* PROFIL */}
            <Section
                title="Personnalisez votre profil"
            >
                <Input
                    label="Nom"
                    value={
                        form.lastName
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "lastName",
                                value,
                            )
                    }
                />

                <Input
                    label="Prénom"
                    value={
                        form.firstName
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "firstName",
                                value,
                            )
                    }
                />

                <Input
                    label="Email"
                    type="email"
                    value={
                        form.email
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "email",
                                value,
                            )
                    }
                />

                <Input
                    label="Téléphone"
                    type="tel"
                    value={
                        form.phone
                    }
                    onChange={
                        (value) =>
                            updateField(
                                "phone",
                                formatPhone(
                                    value,
                                ),
                            )
                    }
                />

                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            text-sm
                        "
                    >
                        Genre
                    </span>

                    <select
                        value={
                            form.gender
                        }
                        onChange={
                            (event) =>
                                updateField(
                                    "gender",
                                    event
                                        .target
                                        .value,
                                )
                        }
                        className="
                            mt-1
                            h-10
                            w-full
                            rounded-md
                            border
                            border-zinc-300
                            bg-white
                            px-3
                        "
                    >
                        <option
                            value="MALE"
                        >
                            Homme
                        </option>

                        <option
                            value="FEMALE"
                        >
                            Femme
                        </option>

                        <option
                            value="OTHER"
                        >
                            Autre
                        </option>
                    </select>
                </label>

                <Input
                    label="Date de naissance"
                    type="date"
                    value=""
                    disabled
                    onChange={() => { }}
                />

                <Input
                    label="Mot de passe"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={
                        form.password
                    }
                    required={false}
                    onChange={
                        (value) =>
                            updateField(
                                "password",
                                value,
                            )
                    }
                />

                <Input
                    label="Confirmation mot de passe"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={
                        form
                            .passwordConfirmation
                    }
                    required={false}
                    onChange={
                        (value) =>
                            updateField(
                                "passwordConfirmation",
                                value,
                            )
                    }
                />

                <label
                    className="
                        flex
                        items-center
                        gap-2
                        text-sm
                    "
                >
                    <input
                        type="checkbox"
                        checked={
                            showPassword
                        }
                        onChange={
                            (event) =>
                                setShowPassword(
                                    event
                                        .target
                                        .checked,
                                )
                        }
                    />

                    Afficher les mots de passe
                </label>

                <ActionButton
                    loading={
                        saving
                        === "profile"
                    }
                    onClick={
                        saveProfile
                    }
                >
                    Mettre à jour
                </ActionButton>
            </Section>

            {/* PREFERENCES */}
            <Section
                title="Préférences de voyage"
            >
                {preferences
                    .filter(
                        (preference) => {
                            const key =
                                normalizePreference(
                                    preference
                                        .description,
                                );

                            return (
                                form.gender
                                === "FEMALE"
                                || key
                                !== "women_only"
                            );
                        },
                    )
                    .map(
                        (preference) => (
                            <ToggleRow
                                key={
                                    preference.id
                                }
                                label={
                                    getPreferenceLabel(
                                        preference
                                            .description,
                                    )
                                }
                                checked={
                                    preferenceValues[
                                    preference
                                        .id
                                    ]
                                    ?? false
                                }
                                onChange={() =>
                                    setPreferenceValues(
                                        (
                                            current,
                                        ) => ({
                                            ...current,

                                            [preference.id]:
                                                !current[
                                                preference
                                                    .id
                                                ],
                                        }),
                                    )
                                }
                            />
                        ),
                    )}

                <ActionButton
                    loading={
                        saving
                        === "preferences"
                    }
                    onClick={
                        savePreferences
                    }
                >
                    Mettre à jour
                </ActionButton>
            </Section>

            {/* VEHICULE */}
            <Section
                title="Décrivez votre véhicule"
            >
                <PicturePicker
                    id="vehicle-picture"
                    src={
                        vehiclePreview
                    }
                    alt="Photo du véhicule"
                    onChange={(file) => {
                        setVehiclePictureFile(
                            file,
                        );

                        selectImage(
                            file,
                            setVehiclePreview,
                        );
                    }}
                />

                <ToggleRow
                    label="Véhicule climatisé"
                    checked={
                        form.hasAc
                    }
                    onChange={() =>
                        updateField(
                            "hasAc",
                            !form.hasAc,
                        )
                    }
                />

                <Input
                    label="Consommation L/100km"
                    type="number"
                    value={
                        form.consumption
                    }
                    required={false}
                    onChange={
                        (value) =>
                            updateField(
                                "consumption",
                                value,
                            )
                    }
                />

                <Input
                    label="Nombre de sièges"
                    type="number"
                    value={
                        form.seat
                    }
                    required={false}
                    onChange={
                        (value) =>
                            updateField(
                                "seat",
                                value,
                            )
                    }
                />

                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            text-sm
                        "
                    >
                        Description
                    </span>

                    <textarea
                        rows={4}
                        value={
                            form
                                .vehicleDescription
                        }
                        placeholder="Décrivez votre véhicule..."
                        onChange={
                            (event) =>
                                updateField(
                                    "vehicleDescription",
                                    event
                                        .target
                                        .value,
                                )
                        }
                        className="
                            mt-1
                            w-full
                            resize-none
                            rounded-md
                            border
                            border-zinc-300
                            p-3
                            text-sm
                            outline-none
                            focus:border-sky-500
                        "
                    />
                </label>

                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            text-sm
                        "
                    >
                        État
                    </span>

                    <select
                        value={
                            form.vehicleState
                        }
                        onChange={
                            (event) =>
                                updateField(
                                    "vehicleState",
                                    event
                                        .target
                                        .value,
                                )
                        }
                        className="
                            mt-1
                            h-10
                            w-full
                            rounded-md
                            border
                            border-zinc-300
                            bg-white
                            px-3
                        "
                    >
                        <option
                            value=""
                        >
                            Sélectionner
                        </option>

                        <option
                            value="VERY_GOOD"
                        >
                            Très bon
                        </option>

                        <option
                            value="GOOD"
                        >
                            Bon
                        </option>

                        <option
                            value="AVERAGE"
                        >
                            Moyen
                        </option>

                        <option
                            value="POOR"
                        >
                            Mauvais
                        </option>
                    </select>
                </label>

                <ActionButton
                    loading={
                        saving
                        === "vehicle"
                    }
                    onClick={
                        saveVehicle
                    }
                >
                    {vehicle
                        ? "Mettre à jour"
                        : "Ajouter le véhicule"}
                </ActionButton>
            </Section>

            {error && (
                <p
                    role="alert"
                    className="
                        rounded-md
                        bg-red-50
                        p-3
                        text-sm
                        text-red-700
                    "
                >
                    {error}
                </p>
            )}

            {message && (
                <p
                    role="status"
                    className="
                        rounded-md
                        bg-green-50
                        p-3
                        text-sm
                        text-green-700
                    "
                >
                    {message}
                </p>
            )}
        </div>
    );
}

function Section({
    title,
    children,
}: {
    title: string;
    children: ReactNode;
}) {
    return (
        <section
            className="
                space-y-3
                rounded-md
                border
                border-zinc-300
                p-4
            "
        >
            <h2
                className="
                    text-xl
                    font-bold
                    text-zinc-900
                "
            >
                {title}
            </h2>

            {children}
        </section>
    );
}

function Input({
    label,
    value,
    onChange,
    type = "text",
    required = true,
    disabled = false,
}: {
    label: string;
    value: string;
    onChange:
    (value: string) => void;
    type?: string;
    required?: boolean;
    disabled?: boolean;
}) {
    return (
        <label
            className="
                block
            "
        >
            <span
                className="
                    text-sm
                    text-zinc-800
                "
            >
                {label}
            </span>

            <input
                type={type}
                value={value}
                required={required}
                disabled={disabled}
                onChange={
                    (event) =>
                        onChange(
                            event
                                .target
                                .value,
                        )
                }
                className="
                    mt-1
                    h-10
                    w-full
                    rounded-md
                    border
                    border-zinc-300
                    px-3
                    text-sm
                    outline-none
                    focus:border-sky-500
                    disabled:bg-zinc-100
                "
            />
        </label>
    );
}

function ToggleRow({
    label,
    checked,
    onChange,
}: {
    label: string;
    checked: boolean;
    onChange: () => void;
}) {
    return (
        <div
            className="
                flex
                items-center
                justify-between
                py-2
            "
        >
            <span
                className="
                    text-sm
                "
            >
                {label}
            </span>

            <button
                type="button"
                role="switch"
                aria-checked={
                    checked
                }
                aria-label={
                    label
                }
                onClick={
                    onChange
                }
                className={`
                    relative
                    h-7
                    w-12
                    shrink-0
                    rounded-full
                    transition-colors
                    ${checked
                        ? "bg-emerald-500"
                        : "bg-zinc-300"
                    }
                `}
            >
                <span
                    aria-hidden="true"
                    className={`
                        absolute
                        left-1
                        top-1
                        h-5
                        w-5
                        rounded-full
                        bg-zinc-100
                        shadow-sm
                        transition-transform
                        duration-200
                        ${checked
                            ? "translate-x-5"
                            : "translate-x-0"
                        }
                    `}
                />
            </button>
        </div>
    );
}

function PicturePicker({
    id,
    src,
    alt,
    large = false,
    onChange,
}: {
    id: string;
    src: string;
    alt: string;
    large?: boolean;
    onChange:
    (file: File) => void;
}) {
    return (
        <label
            htmlFor={id}
            className={`
                relative
                flex
                cursor-pointer
                items-center
                justify-center
                overflow-hidden
                bg-zinc-300
                ${large
                    ? "h-32 w-28 rounded-md"
                    : "h-16 w-16 rounded-full border-2 border-sky-500"
                }
            `}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="
                        h-full
                        w-full
                        object-cover
                    "
                />
            ) : (
                <Camera
                    size={
                        large
                            ? 32
                            : 24
                    }
                    className="
                        text-zinc-500
                    "
                />
            )}

            <span
                className="
                    absolute
                    inset-0
                    flex
                    items-center
                    justify-center
                    bg-black/20
                "
            >
                <Pencil
                    size={
                        large
                            ? 20
                            : 18
                    }
                    className="
                        text-white
                    "
                />
            </span>

            <input
                id={id}
                type="file"
                accept="image/*"
                className="
                    hidden
                "
                onChange={
                    (event) => {
                        const file =
                            event
                                .target
                                .files?.[0];

                        if (file) {
                            onChange(
                                file,
                            );
                        }
                    }
                }
            />
        </label>
    );
}

function ActionButton({
    children,
    loading,
    onClick,
}: {
    children: ReactNode;
    loading: boolean;
    onClick:
    () => Promise<void>;
}) {
    return (
        <button
            type="button"
            disabled={loading}
            onClick={() =>
                void onClick()
            }
            className="
                h-10
                w-full
                rounded-md
                bg-sky-600
                text-sm
                font-medium
                text-white
                transition
                hover:bg-sky-700
                disabled:opacity-50
            "
        >
            {loading
                ? "Enregistrement..."
                : children}
        </button>
    );
}