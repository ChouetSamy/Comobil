<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
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

        if (!$user instanceof User) {
            return [];
        }

        if ($operation->getName() === 'my_trips_past') {
            return $this->tripRepository
                ->findPastTripsForUser($user);
        }

        return $this->tripRepository
            ->findUpcomingTripsForUser($user);
    }
}