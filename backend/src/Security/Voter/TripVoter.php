<?php

namespace App\Security\Voter;

use App\Entity\Trip;
use App\Entity\TripPreference;
use App\Entity\User;
use App\Enum\Gender;
use App\Enum\Trip_Status;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class TripVoter extends Voter
{
    public const VIEW = 'TRIP_VIEW';
    public const EDIT = 'TRIP_EDIT';
    public const DELETE = 'TRIP_DELETE';

    protected function supports(
        string $attribute,
        mixed $subject
    ): bool {
        return $subject instanceof Trip
            && in_array(
                $attribute,
                [
                    self::VIEW,
                    self::EDIT,
                    self::DELETE,
                ],
                true
            );
    }

    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
        ?Vote $vote = null
    ): bool {
        $user = $token->getUser();

        /*
         * On utilise directement App\Entity\User
         * car on a besoin de getGender().
         */
        if (!$user instanceof User) {
            $vote?->addReason(
                'The user must be logged in.'
            );

            return false;
        }

        /** @var Trip $trip */
        $trip = $subject;

        /*
         * Les admins et modérateurs
         * ont accès à tous les trajets.
         */
        if (
            in_array(
                'ROLE_ADMIN',
                $user->getRoles(),
                true
            )
            || in_array(
                'ROLE_MODERATOR',
                $user->getRoles(),
                true
            )
        ) {
            return true;
        }

        /*
         * Un trajet annulé
         * n'est plus accessible.
         */
        if (
            $trip->getTripStatus()
            === Trip_Status::CANCELLED
        ) {
            return false;
        }

        /*
         * Vérifie si le trajet
         * possède la préférence
         * women_only active.
         */
        $womenOnly =
            $trip
                ->getTripPreferences()
                ->exists(
                    static function (
                        int $key,
                        TripPreference $tripPreference
                    ): bool {
                        return
                            $tripPreference->isActive()
                            && $tripPreference
                                ->getPreference()
                                ?->getDescription()
                                === 'women_only';
                    }
                );

        /*
         * Un utilisateur masculin
         * ne peut pas consulter
         * un trajet réservé aux femmes.
         */
        if (
            $womenOnly
            && $user->getGender()
                !== Gender::FEMALE
        ) {
            return false;
        }

        return match ($attribute) {
            /*
             * Tout utilisateur autorisé
             * peut consulter le trajet.
             */
            self::VIEW => true,

            /*
             * Seul le créateur
             * peut modifier ou supprimer.
             */
            self::EDIT,
            self::DELETE =>
                $trip->getCreator()
                === $user,

            default => false,
        };
    }
}