<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\TripRepository;
use Symfony\Bundle\SecurityBundle\Security;

final class TripSearchProvider implements ProviderInterface
{
    public function __construct(
        private TripRepository $tripRepository,
        private Security $security,
    ) {
    }

    public function provide(
        Operation $operation,
        array $uriVariables = [],
        array $context = [],
    ): array {
        $filters = $context['filters'] ?? [];

        $departureCommune = $filters['departureCommune'] ?? null;
        $arrivalCommune = $filters['arrivalCommune'] ?? null;

        $departureDate = isset($filters['departureDate'])
            ? new \DateTime($filters['departureDate'])
            : null;

        $departureTime = null;

        if ($departureDate !== null && isset($filters['departureTime'])) {
            $departureTime = new \DateTime(
                $departureDate->format('Y-m-d') . ' ' . $filters['departureTime']
            );
        }

        $preferencesFilter = $filters['preferences'] ?? [];

        return $this->tripRepository->searchTrips(
            $departureCommune,
            $arrivalCommune,
            $departureDate,
            $departureTime,
            $preferencesFilter,
        );
    }
}