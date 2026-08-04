<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Message;
use App\Entity\Notification;
use App\Entity\Traveler;
use App\Entity\User;
use App\Enum\Traveler_Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

final class MessageProcessor implements ProcessorInterface
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
        /** @var Message $message */
        $message = $data;

        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException();
        }

        $trip = $message->getTrip();
        $receiver = $message->getReceiver();

        if ($trip === null || $receiver === null) {
            throw new ConflictHttpException(
                'A trip and a receiver are required.'
            );
        }

        if ($receiver === $user) {
            throw new ConflictHttpException(
                'You cannot send a message to yourself.'
            );
        }

        $senderIsTripCreator = $trip->getCreator() === $user;

        $senderIsTraveler = $trip->getTravelers()->exists(
            function (int $key, Traveler $traveler) use ($user): bool {
                return $traveler->getUser() === $user
                    && $traveler->getTravelerStatus()
                    !== Traveler_Status::EXCLUDED;
            }
        );

        if (!$senderIsTripCreator && !$senderIsTraveler) {
            throw new AccessDeniedHttpException(
                'You must participate in the trip to send a message.'
            );
        }

        $receiverIsTripCreator = $trip->getCreator() === $receiver;

        $receiverIsTraveler = $trip->getTravelers()->exists(
            function (int $key, Traveler $traveler) use ($receiver): bool {
                return $traveler->getUser() === $receiver
                    && $traveler->getTravelerStatus()
                    !== Traveler_Status::EXCLUDED;
            }
        );

        if (!$receiverIsTripCreator && !$receiverIsTraveler) {
            throw new AccessDeniedHttpException(
                'The receiver does not participate in this trip.'
            );
        }

        $message->setSender($user);

        $notification = new Notification();

        $notification
            ->setReceiver($receiver)
            ->setTrip($trip)
            ->setContent(
                'Vous avez reçu un nouveau message concernant un trajet.'
            );

        $this->entityManager->persist($message);
        $this->entityManager->persist($notification);
        $this->entityManager->flush();

        return $message;
    }
}