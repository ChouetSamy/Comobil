<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use App\Entity\Trip;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;

class ConversationProvider implements ProviderInterface
{
    public function __construct(
        private MessageRepository $repository,
        private Security $security,
        private EntityManagerInterface $em,
    ) {
    }

    public function provide(
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): array {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return [];
        }

        $otherUser = $this->em->getRepository(User::class)
            ->find($uriVariables['userId']);

        $trip = $this->em->getRepository(Trip::class)
            ->find($uriVariables['tripId']);

        if (!$otherUser || !$trip) {
            return [];
        }

        return $this->repository->findConversation(
            $user,
            $otherUser,
            $trip
        );
    }
}