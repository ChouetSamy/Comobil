<?php

namespace App\Repository;

use App\Entity\Trip;
use App\Entity\User;
use App\Enum\Trip_Status;
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
            ->andWhere('t.departureDatetime >= :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTime())
            ->orderBy('t.departureDatetime', 'ASC')
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
            ->andWhere('t.departureDatetime < :now')
            ->setParameter('user', $user)
            ->setParameter('now', new \DateTime())
            ->orderBy('t.departureDatetime', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Recherche des trajets selon différents critères.
     *
     * @return Trip[]
     */
    public function searchTrips(
        ?string $departureCommune,
        ?string $arrivalCommune,
        ?\DateTimeInterface $departureDate,
        ?\DateTimeInterface $departureTime,
        ?array $preferencesFilter,
    ): array {
        $queryBuilder = $this->createQueryBuilder('t')
            ->leftJoin('t.departureAddress', 'departureAddress')
            ->leftJoin('departureAddress.city', 'departureCity')
            ->leftJoin('t.arrivalAddress', 'arrivalAddress')
            ->leftJoin('arrivalAddress.city', 'arrivalCity')
            ->leftJoin('t.tripPreferences', 'tripPreference')
            ->leftJoin('tripPreference.preference', 'preference')
            ->andWhere('t.tripStatus != :cancelled')
            ->andWhere('t.availableSeats > 0')
            ->setParameter('cancelled', Trip_Status::CANCELLED);

        if ($departureCommune !== null) {
            $queryBuilder
                ->andWhere(
                    'LOWER(departureCity.commune) = LOWER(:departureCommune)'
                )
                ->setParameter('departureCommune', $departureCommune);
        }

        if ($arrivalCommune !== null) {
            $queryBuilder
                ->andWhere(
                    'LOWER(arrivalCity.commune) = LOWER(:arrivalCommune)'
                )
                ->setParameter('arrivalCommune', $arrivalCommune);
        }

        if ($departureDate !== null) {
            $start = new \DateTimeImmutable(
                $departureDate->format('Y-m-d') . ' 00:00:00'
            );

            $end = $start->modify('+1 day');

            $queryBuilder
                ->andWhere('t.departureDatetime >= :start')
                ->andWhere('t.departureDatetime < :end')
                ->setParameter('start', $start)
                ->setParameter('end', $end);
        }

        if ($preferencesFilter !== null && $preferencesFilter !== []) {
            $queryBuilder
                ->andWhere(
                    'tripPreference.isActive = true
                    AND preference.description IN (:preferences)'
                )
                ->setParameter('preferences', $preferencesFilter)
                ->groupBy('t.id')
                ->having(
                    'COUNT(DISTINCT preference.description) = :preferencesCount'
                )
                ->setParameter(
                    'preferencesCount',
                    count($preferencesFilter)
                );
        }

        $queryBuilder
            ->orderBy('t.departureDatetime', 'ASC');

        $trips = $queryBuilder
            ->getQuery()
            ->getResult();

        if ($departureTime !== null) {
            $queryBuilder
                ->andWhere('t.departureDatetime >= :departureTime')
                ->setParameter('departureTime', $departureTime);
        }

        return $trips;
    }
}