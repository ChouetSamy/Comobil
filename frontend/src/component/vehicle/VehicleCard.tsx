import {
    Fuel,
    Snowflake,
} from "lucide-react";

const API_URL =
    import.meta.env.VITE_API_URL
    ?? "http://localhost:8080";

export interface VehicleCardData {
    id: number;

    pictureUrl?: string | null;

    seat?: number | null;

    hasAc?: boolean | null;

    consumptionLiterPer100km?:
        number | null;

    vehicleState?: string | null;

    description?: string | null;
}

interface VehicleCardProps {
    vehicle: VehicleCardData;
    showDescription?: boolean;
}

export default function VehicleCard({
    vehicle,
    showDescription = true,
}: VehicleCardProps) {
    return (
        <section
            className="
                mt-3
                overflow-hidden
                rounded-xl
                border
                border-zinc-200
                bg-white
            "
        >
            {/* Véhicule */}
            <div
                className="
                    flex
                    items-center
                    gap-3
                    p-3
                "
            >
                <VehiclePicture
                    src={
                        vehicle.pictureUrl
                    }
                />

                <div>
                    <strong
                        className="
                            text-sm
                            text-zinc-700
                        "
                    >
                        {vehicle.seat ?? "?"}{" "}
                        Sièges
                    </strong>

                    <p
                        className="
                            text-xs
                            text-zinc-500
                        "
                    >
                        {formatVehicleState(
                            vehicle.vehicleState,
                        )}
                    </p>
                </div>
            </div>

            {/* Climatisation */}
            <VehicleInfoRow
                icon={
                    <Snowflake
                        size={22}
                        className="text-sky-500"
                    />
                }
                text={
                    vehicle.hasAc
                        ? "Climatisé"
                        : "Non climatisé"
                }
            />

            {/* Consommation */}
            <VehicleInfoRow
                icon={
                    <Fuel
                        size={22}
                        className="text-sky-500"
                    />
                }
                text={
                    vehicle
                        .consumptionLiterPer100km
                        !== null
                    && vehicle
                        .consumptionLiterPer100km
                        !== undefined
                        ? `${vehicle.consumptionLiterPer100km}L/100`
                        : "Consommation non renseignée"
                }
            />

            {/* Description */}
            {showDescription && (
                <div
                    className="
                        border-t
                        border-zinc-200
                        p-4
                    "
                >
                    <h3
                        className="
                            text-lg
                            font-semibold
                            text-zinc-700
                        "
                    >
                        Description
                    </h3>

                    <p
                        className="
                            mt-2
                            whitespace-pre-line
                            text-sm
                            leading-5
                            text-zinc-500
                        "
                    >
                        {vehicle.description
                            || "Aucune description du véhicule."}
                    </p>
                </div>
            )}
        </section>
    );
}

function VehicleInfoRow({
    icon,
    text,
}: {
    icon: React.ReactNode;
    text: string;
}) {
    return (
        <div
            className="
                flex
                min-h-14
                items-center
                gap-3
                border-t
                border-zinc-200
                px-4
                py-2
            "
        >
            {icon}

            <span
                className="
                    text-sm
                    text-zinc-600
                "
            >
                {text}
            </span>
        </div>
    );
}

function VehiclePicture({
    src,
}: {
    src?: string | null;
}) {
    if (!src) {
        return (
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
                "
            >
                🚗
            </div>
        );
    }

    return (
        <img
            src={
                resolveImageUrl(src)
            }
            alt="Véhicule"
            className="
                h-12
                w-12
                shrink-0
                rounded-full
                object-cover
            "
        />
    );
}

function resolveImageUrl(
    url: string,
): string {
    if (
        url.startsWith("http://")
        || url.startsWith("https://")
        || url.startsWith("blob:")
        || url.startsWith("data:")
    ) {
        return url;
    }

    return `${API_URL}${url}`;
}

function formatVehicleState(
    state?: string | null,
): string {
    if (!state) {
        return "État non renseigné";
    }

    switch (
        state.toUpperCase()
    ) {
        case "NEW":
            return "Neuf";

        case "VERY_GOOD":
            return "Très bon état";

        case "GOOD":
            return "Bon état";

        case "AVERAGE":
            return "État moyen";

        case "USED":
            return "Usagé";

        case "POOR":
            return "Mauvais état";

        default:
            return state;
    }
}