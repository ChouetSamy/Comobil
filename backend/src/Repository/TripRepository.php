<?php

namespace App\Repository;

use App\Entity\Trip;
use App\Entity\User;
use App\Enum\Trip_Status;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use App\Entity\TripPreference;

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
            ->distinct()
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
            ->distinct()
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
        bool $canViewWomenOnly = false,
    ): array {
        $now = new \DateTimeImmutable();

        $queryBuilder = $this->createQueryBuilder('t')
            ->distinct()
            ->leftJoin('t.departureAddress', 'departureAddress')
            ->leftJoin('departureAddress.city', 'departureCity')
            ->leftJoin('t.arrivalAddress', 'arrivalAddress')
            ->leftJoin('arrivalAddress.city', 'arrivalCity')
            ->leftJoin('t.tripPreferences', 'tripPreference')
            ->leftJoin('tripPreference.preference', 'preference')

            // Jamais de trajet annulé
            ->andWhere('t.tripStatus != :cancelled')

            // Jamais de trajet complet
            ->andWhere('t.availableSeats > 0')

            // Jamais de trajet passé
            ->andWhere('t.departureDatetime >= :now')

            ->setParameter(
                'cancelled',
                Trip_Status::CANCELLED
            )
            ->setParameter(
                'now',
                $now
            );

        /*
     * Ville de départ facultative
     */
        if (
            $departureCommune !== null
            && trim($departureCommune) !== ''
        ) {
            $queryBuilder
                ->andWhere(
                    'LOWER(departureCity.commune) = LOWER(:departureCommune)'
                )
                ->setParameter(
                    'departureCommune',
                    trim($departureCommune)
                );
        }

        /*
     * Ville d'arrivée facultative
     */
        if (
            $arrivalCommune !== null
            && trim($arrivalCommune) !== ''
        ) {
            $queryBuilder
                ->andWhere(
                    'LOWER(arrivalCity.commune) = LOWER(:arrivalCommune)'
                )
                ->setParameter(
                    'arrivalCommune',
                    trim($arrivalCommune)
                );
        }

        /*
     * Date facultative.
     *
     * Si elle existe :
     * on cherche uniquement entre
     * 00:00 et 23:59:59 de cette journée.
     */
        if ($departureDate !== null) {
            $start =
                new \DateTimeImmutable(
                    $departureDate->format('Y-m-d')
                        . ' 00:00:00'
                );

            $end =
                $start->modify('+1 day');

            $queryBuilder
                ->andWhere(
                    't.departureDatetime >= :start'
                )
                ->andWhere(
                    't.departureDatetime < :end'
                )
                ->setParameter(
                    'start',
                    $start
                )
                ->setParameter(
                    'end',
                    $end
                );
        }

        /*
     * Heure facultative.
     *
     * Le Provider ne la construit
     * que lorsqu'une date existe.
     */
        if ($departureTime !== null) {
            $queryBuilder
                ->andWhere(
                    't.departureDatetime >= :departureTime'
                )
                ->setParameter(
                    'departureTime',
                    $departureTime
                );
        }

        /*
     * Préférences facultatives.
     */
        if (
            $preferencesFilter !== null
            && $preferencesFilter !== []
        ) {
            $queryBuilder
                ->andWhere(
                    'tripPreference.isActive = true'
                )
                ->andWhere(
                    'preference.description IN (:preferences)'
                )
                ->setParameter(
                    'preferences',
                    $preferencesFilter
                )
                ->groupBy(
                    't.id'
                )
                ->having(
                    'COUNT(DISTINCT preference.description) = :preferencesCount'
                )
                ->setParameter(
                    'preferencesCount',
                    count(
                        $preferencesFilter
                    )
                );
        }

        if (!$canViewWomenOnly) {
            /*
     * Recherche les TripPreference
     * "women_only" actives pour le trajet.
     */
            $womenOnlySubQuery =
                $this
                ->getEntityManager()
                ->createQueryBuilder()
                ->select('1')
                ->from(
                    TripPreference::class,
                    'restrictedTripPreference'
                )
                ->join(
                    'restrictedTripPreference.preference',
                    'restrictedPreference'
                )
                ->where(
                    'restrictedTripPreference.trip = t'
                )
                ->andWhere(
                    'restrictedTripPreference.isActive = true'
                )
                ->andWhere(
                    'restrictedPreference.description = :womenOnly'
                );

            /*
     * Pour un homme :
     * le trajet est totalement retiré
     * de la recherche.
     */
            $queryBuilder
                ->andWhere(
                    $queryBuilder
                        ->expr()
                        ->not(
                            $queryBuilder
                                ->expr()
                                ->exists(
                                    $womenOnlySubQuery
                                        ->getDQL()
                                )
                        )
                )
                ->setParameter(
                    'womenOnly',
                    'women_only'
                );
        }

        return $queryBuilder
            ->orderBy(
                't.departureDatetime',
                'ASC'
            )

            // MVP : maximum 50 résultats
            ->setMaxResults(50)

            ->getQuery()
            ->getResult();
    }
}
