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
        if (!$data instanceof Message) {
            throw new \LogicException('Invalid data type.');
        }

        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException();
        }

        $trip = $data->getTrip();

        if ($trip === null) {
            throw new ConflictHttpException(
                'A trip is required.'
            );
        }

        /*
         * Vérifie que l'expéditeur participe au trajet.
         */
        $senderIsCreator = $trip->getCreator() === $user;

        $senderIsTraveler = $trip->getTravelers()->exists(
            function (int $key, Traveler $traveler) use ($user): bool {
                return $traveler->getUser() === $user
                    && $traveler->getTravelerStatus()
                        !== Traveler_Status::EXCLUDED;
            }
        );

        if (!$senderIsCreator && !$senderIsTraveler) {
            throw new AccessDeniedHttpException(
                'You must participate in the trip to send a message.'
            );
        }

        $data->setSender($user);

        $receiver = $data->getReceiver();

        /*
         * ==========================================================
         * MESSAGE DE GROUPE
         * ==========================================================
         *
         * receiver === null
         * Le message appartient au chat collectif du trajet.
         */
        if ($receiver === null) {
            $this->createGroupNotifications(
                $data,
                $user
            );

            $this->entityManager->persist($data);
            $this->entityManager->flush();

            return $data;
        }

        /*
         * ==========================================================
         * MESSAGE PRIVÉ
         * ==========================================================
         */

        if ($receiver === $user) {
            throw new ConflictHttpException(
                'You cannot send a message to yourself.'
            );
        }

        $receiverIsCreator =
            $trip->getCreator() === $receiver;

        $receiverIsTraveler =
            $trip->getTravelers()->exists(
                function (
                    int $key,
                    Traveler $traveler
                ) use ($receiver): bool {
                    return $traveler->getUser() === $receiver
                        && $traveler->getTravelerStatus()
                            !== Traveler_Status::EXCLUDED;
                }
            );

        if (!$receiverIsCreator && !$receiverIsTraveler) {
            throw new AccessDeniedHttpException(
                'The receiver does not participate in this trip.'
            );
        }

        $notification = new Notification();

        $notification
            ->setReceiver($receiver)
            ->setTrip($trip)
            ->setContent(
                'Vous avez reçu un nouveau message concernant un trajet.'
            );

        $this->entityManager->persist($data);
        $this->entityManager->persist($notification);
        $this->entityManager->flush();

        return $data;
    }

    /**
     * Crée une notification pour chaque participant du trajet,
     * sauf l'auteur du message.
     */
    private function createGroupNotifications(
        Message $message,
        User $sender,
    ): void {
        $trip = $message->getTrip();

        if ($trip === null) {
            return;
        }

        /*
         * Notification du créateur si ce n'est pas lui
         * qui envoie le message.
         */
        $creator = $trip->getCreator();

        if ($creator !== $sender) {
            $this->createNotification(
                $creator,
                $message
            );
        }

        /*
         * Notification des voyageurs non exclus.
         */
        foreach ($trip->getTravelers() as $traveler) {
            if (
                $traveler->getTravelerStatus()
                    === Traveler_Status::EXCLUDED
            ) {
                continue;
            }

            $receiver = $traveler->getUser();

            if (
                $receiver === null
                || $receiver === $sender
                || $receiver === $creator
            ) {
                continue;
            }

            $this->createNotification(
                $receiver,
                $message
            );
        }
    }

    private function createNotification(
        User $receiver,
        Message $message,
    ): void {
        $notification = new Notification();

        $notification
            ->setReceiver($receiver)
            ->setTrip($message->getTrip())
            ->setContent(
                'Un nouveau message a été envoyé dans la conversation du trajet.'
            );

        $this->entityManager->persist($notification);
    }
}