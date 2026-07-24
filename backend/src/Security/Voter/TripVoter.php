<?php

namespace App\Security\Voter;

use App\Entity\Trip;
use App\Enum\Trip_Status;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class TripVoter extends Voter
{
    public const VIEW = 'TRIP_VIEW';
    public const EDIT = 'TRIP_EDIT';
    public const DELETE = 'TRIP_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $subject instanceof Trip
            && in_array($attribute, [
                self::VIEW,
                self::EDIT,
                self::DELETE,
            ], true);
    }

    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
        ?Vote $vote = null
    ): bool {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            $vote?->addReason('The user must be logged in.');

            return false;
        }

        // Admin et modérateur ont accès à tout
        if (
            in_array('ROLE_ADMIN', $user->getRoles(), true)
            || in_array('ROLE_MODERATOR', $user->getRoles(), true)
        ) {
            return true;
        }

        /** @var Trip $trip */
        $trip = $subject;

        if ($trip->getTripStatus() === Trip_Status::CANCELLED) {
            return false;
        }

        return match ($attribute) {
            self::VIEW => true,

            self::EDIT,
            self::DELETE => $trip->getCreator() === $user,

            default => false,
        };
    }
}