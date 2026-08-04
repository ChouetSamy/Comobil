<?php

namespace App\Repository;

use App\Entity\Message;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Message>
 */
class MessageRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Message::class);
    }

    /**
     * Retourne les messages envoyés ou reçus par un utilisateur,
     * du plus récent au plus ancien.
     *
     * @return Message[]
     */
    public function findMessagesForUser(User $user): array
    {
        return $this->createQueryBuilder('m')
            ->andWhere(
                'm.sender = :user OR m.receiver = :user'
            )
            ->setParameter('user', $user)
            ->orderBy('m.createdAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Retourne l'historique des messages entre deux utilisateurs
     * pour un trajet donné.
     *
     * @return Message[]
     */
    public function findConversation(
        User $user,
        User $otherUser,
        ?\App\Entity\Trip $trip = null
    ): array {
        $qb = $this->createQueryBuilder('m')
            ->andWhere(
                '(m.sender = :user AND m.receiver = :otherUser)
            OR
            (m.sender = :otherUser AND m.receiver = :user)'
            )
            ->setParameter('user', $user)
            ->setParameter('otherUser', $otherUser);

        if ($trip !== null) {
            $qb
                ->andWhere('m.trip = :trip')
                ->setParameter('trip', $trip);
        }

        return $qb
            ->orderBy('m.createdAt', 'ASC')
            ->getQuery()
            ->getResult();
    }


    public function findConversations(User $user): array
    {
        return $this->createQueryBuilder('m')
            ->select(
                'MAX(m.createdAt) AS lastMessageAt',
                'IDENTITY(m.trip) AS tripId',
                'CASE 
                WHEN m.sender = :user THEN IDENTITY(m.receiver)
                ELSE IDENTITY(m.sender)
            END AS interlocutorId'
            )
            ->where('m.sender = :user OR m.receiver = :user')
            ->setParameter('user', $user)
            ->groupBy('tripId')
            ->addGroupBy('interlocutorId')
            ->orderBy('lastMessageAt', 'DESC')
            ->getQuery()
            ->getArrayResult();
    }
}