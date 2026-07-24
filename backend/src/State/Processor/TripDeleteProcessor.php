<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Trip;
use App\Entity\Notification;
use App\Enum\Notification_Type;
use App\Enum\Trip_Status;
use Doctrine\ORM\EntityManagerInterface;


final class TripDeleteProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): mixed {
        /** @var Trip $trip */
        $trip = $data;

        $trip->setTripStatus(Trip_Status::CANCELLED);

        foreach ($trip->getTravelers() as $traveler) {
            $user = $traveler->getUser();

            if ($user === null) {
                continue;
            }

            $notification = new Notification();
            $notification
                ->setReceiver($user)
                ->setTrip($trip)
                ->setContent('The trip has been cancelled.')
                ->setNotificationType(Notification_Type::PERSONNAL);

            $this->entityManager->persist($notification);
        }

        $this->entityManager->flush();

        return null;
    }
}