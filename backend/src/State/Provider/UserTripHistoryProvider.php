<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Repository\TripRepository;
use Symfony\Bundle\SecurityBundle\Security;

final class UserTripHistoryProvider implements ProviderInterface
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
        $user = $this->security->getUser();

        if (!$user) {
            return [];
        }

        $status = $uriVariables['status'] ?? 'upcoming';

        if ($status === 'past') {
            return $this->tripRepository->findPastTripsForUser($user);
        }

        return $this->tripRepository->findUpcomingTripsForUser($user);
    }
}