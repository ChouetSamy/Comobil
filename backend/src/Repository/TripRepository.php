<?php

namespace App\Repository;

use App\Entity\Trip;
use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Trip>
 */
class TripRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Trip::class);
    }

    /**
     * Retourne les trajets à venir auxquels l'utilisateur participe
     * en tant que créateur ou voyageur.
     *
     * @return Trip[]
     */
    public function findUpcomingTripsForUser(User $user): array
    {
        return $this->createQueryBuilder('t')
            ->leftJoin('t.travelers', 'traveler')
            ->andWhere(
                't.creator = :user OR traveler.user = :user'
            )
            ->andWhere('t.departure_datetime >= :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTime())
            ->orderBy('t.departure_datetime', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Retourne les trajets passés auxquels l'utilisateur a participé
     * en tant que créateur ou voyageur.
     *
     * @return Trip[]
     */
    public function findPastTripsForUser(User $user): array
    {
        return $this->createQueryBuilder('t')
            ->leftJoin('t.travelers', 'traveler')
            ->andWhere(
                't.creator = :user OR traveler.user = :user'
            )
            ->andWhere('t.departure_datetime < :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTime())
            ->orderBy('t.departure_datetime', 'DESC')
            ->getQuery()
            ->getResult();
    }
}