<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Traveler;
use App\Entity\User;
use App\Enum\Gender;
use App\Enum\Traveler_Status;
use App\Repository\TravelerRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\ConflictHttpException;

final class TravelerProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private Security $security,
        private TravelerRepository $travelerRepository,
    ) {
    }

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = [],
    ): mixed {
        /** @var Traveler $traveler */
        $traveler = $data;

        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException(
                'You must be authenticated.'
            );
        }

        $trip = $traveler->getTrip();

        if ($trip === null) {
            throw new AccessDeniedHttpException(
                'Trip not found.'
            );
        }

        /*
         * Interdit de rejoindre deux fois
         * le même trajet.
         */
        $existingTraveler =
            $this->travelerRepository
                ->findOneBy([
                    'trip' => $trip,
                    'user' => $user,
                ]);

        if ($existingTraveler !== null) {
            if (
                $existingTraveler->getTravelerStatus()
                === Traveler_Status::EXCLUDED
            ) {
                throw new AccessDeniedHttpException(
                    'You have been excluded from this trip.'
                );
            }

            throw new ConflictHttpException(
                'You have already joined this trip.'
            );
        }

        /*
         * Interdit aux hommes de rejoindre
         * un trajet réservé aux femmes.
         */
        foreach (
            $trip->getTripPreferences()
            as $tripPreference
        ) {
            if (
                $tripPreference
                    ->getPreference()
                    ?->getDescription()
                    === 'women_only'
                && $tripPreference->isActive()
                && $user->getGender()
                    !== Gender::FEMALE
            ) {
                throw new AccessDeniedHttpException(
                    'This trip is reserved for women.'
                );
            }
        }

        /*
         * L'utilisateur n'est JAMAIS choisi
         * par le frontend.
         *
         * Il vient du JWT.
         */
        $traveler->setUser($user);

        $this->entityManager->persist(
            $traveler
        );

        $this->entityManager->flush();

        return $traveler;
    }
}