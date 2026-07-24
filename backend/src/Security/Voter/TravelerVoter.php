<?php

namespace App\Security\Voter;

use App\Entity\Traveler;
use App\Entity\User;
use App\Enum\Gender;
use App\Enum\Trip_Status;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class TravelerVoter extends Voter
{
    public const JOIN = 'TRAVELER_JOIN';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $attribute === self::JOIN
            && $subject instanceof Traveler;
    }

    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
        ?Vote $vote = null
    ): bool {
        $user = $token->getUser();

        if (!$user instanceof User) {
            return false;
        }

        /** @var Traveler $traveler */
        $traveler = $subject;

        $trip = $traveler->getTrip();

        if ($trip === null) {
            return false;
        }

        if ($trip->getTripStatus() === Trip_Status::CANCELLED) {
            return false;
        }

        // Récupérer les préférences du trajet
        foreach ($trip->getTripPreferences() as $tripPreference) {
            $preference = $tripPreference->getPreference();

            if (
                $tripPreference->getPreference()?->getDescription() === 'women_only'
                && $tripPreference->isActive()
                && $user->getGender() !== Gender::FEMALE
            ) {
                throw new AccessDeniedHttpException(
                    'This trip is reserved for women.'
                );
            }
            
        }

        return true;
    }
}