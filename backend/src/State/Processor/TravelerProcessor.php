<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Traveler;
use App\Enum\Traveler_Status;
use App\Entity\User;
use App\Enum\Gender;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use App\Repository\TravelerRepository;
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
        array $context = []
    ): mixed {
        /** @var Traveler $traveler */
        $traveler = $data;

        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException();
        }

        $trip = $traveler->getTrip();

        if ($trip === null) {
            throw new AccessDeniedHttpException('Trip not found.');
        }

        $existingTraveler = $this->travelerRepository->findOneBy([
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

        foreach ($trip->getTripPreferences() as $tripPreference) {
            if (
                $tripPreference->getPreference()?->getName() === "women_only"
                && $tripPreference->isActive()
                && $user->getGender() !== Gender::FEMALE
            ) {
                throw new AccessDeniedHttpException(
                    'This trip is reserved for women.'
                );
            }
        }

        // Le participant doit être l'utilisateur authentifié
        $traveler->setUser($user);

        $this->entityManager->persist($traveler);
        $this->entityManager->flush();

        return $traveler;
    }
}