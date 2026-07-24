<?php

namespace App\State\Processor;

use App\Entity\Notification;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Traveler;
use App\Entity\User;
use App\Enum\Traveler_Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

final class TravelerExclusionProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
    ) {
    }

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = [],
    ): mixed {
        /** @var Traveler $traveler */
        $traveler = $data;

        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException();
        }

        $trip = $traveler->getTrip();

        if ($trip === null || $trip->getCreator() !== $user) {
            throw new AccessDeniedHttpException(
                'Only the trip creator can exclude a traveler.'
            );
        }

        if ($traveler->getUser() === $user) {
            throw new ConflictHttpException(
                'You cannot exclude yourself from your own trip.'
            );
        }

        if ($traveler->getTravelerStatus() === Traveler_Status::EXCLUDED) {
            return $traveler;
        }

        $traveler->setTravelerStatus(Traveler_Status::EXCLUDED);

        $trip->setAvailableSeats(
            $trip->getAvailableSeats() + 1
        );

        $notification = new Notification();

        $notification
            ->setReceiver($traveler->getUser())
            ->setTrip($trip)
            ->setContent(
                sprintf(
                    'Vous avez été exclu du trajet %s → %s.',
                    $trip->getDepartureAddress()?->getCity()?->getCommune(),
                    $trip->getArrivalAddress()?->getCity()?->getCommune()
                )
            );

        $this->entityManager->persist($notification);

        $this->entityManager->flush();

        return $traveler;
    }
}