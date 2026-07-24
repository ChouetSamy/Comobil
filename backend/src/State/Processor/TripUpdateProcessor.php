<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Notification;
use App\Entity\Trip;
use App\Enum\Notification_Type;
use Doctrine\ORM\EntityManagerInterface;

final class TripUpdateProcessor implements ProcessorInterface
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

        foreach ($trip->getTravelers() as $traveler) {
            $user = $traveler->getUser();

            if ($user === null) {
                continue;
            }

            $notification = new Notification();
            $notification
                ->setReceiver($user)
                ->setTrip($trip)
                ->setContent('The trip has been modified.')
                ->setNotificationType(Notification_Type::PERSONNAL);

            $this->entityManager->persist($notification);
        }

        $this->entityManager->flush();

        return $trip;
    }
}