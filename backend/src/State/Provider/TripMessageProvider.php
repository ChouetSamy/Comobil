<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Trip;
use App\Entity\Traveler;
use App\Entity\User;
use App\Enum\Traveler_Status;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class TripMessageProvider implements ProviderInterface
{
    public function __construct(
        private MessageRepository $messageRepository,
        private Security $security,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function provide(
        Operation $operation,
        array $uriVariables = [],
        array $context = [],
    ): array {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException(
                'User must be authenticated.'
            );
        }

        $tripId = $uriVariables['tripId'] ?? null;

        if ($tripId === null) {
            return [];
        }

        $trip = $this->entityManager
            ->getRepository(Trip::class)
            ->find($tripId);

        if (!$trip instanceof Trip) {
            return [];
        }

        /*
         * Le créateur fait automatiquement partie
         * de la conversation du trajet.
         */
        $isCreator =
            $trip->getCreator() === $user;

        /*
         * Sinon, l'utilisateur doit être un voyageur
         * du trajet et ne pas avoir été exclu.
         */
        $isTraveler =
            $trip->getTravelers()->exists(
                function (
                    int $key,
                    Traveler $traveler,
                ) use ($user): bool {
                    return (
                        $traveler->getUser() === $user
                        && $traveler->getTravelerStatus()
                            !== Traveler_Status::EXCLUDED
                    );
                }
            );

        if (!$isCreator && !$isTraveler) {
            throw new AccessDeniedHttpException(
                'You must participate in the trip to access its messages.'
            );
        }

        
        return $this->messageRepository
            ->findTripMessages($trip);
    }
}