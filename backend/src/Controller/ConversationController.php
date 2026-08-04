<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Trip;
use App\Repository\MessageRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class ConversationController
{
    public function __construct(
        private MessageRepository $repository,
        private Security $security,
        private EntityManagerInterface $em,
    ) {
    }

    #[Route(
        '/api/messages/conversations',
        name: 'app_conversation',
        methods: ['GET'],
        priority: 10
    )]
    public function conversations(): JsonResponse
    {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            return new JsonResponse(['message' => 'Unauthorized'], 401);
        }

        return new JsonResponse(
            $this->repository->findConversations($user)
        );
    }

}