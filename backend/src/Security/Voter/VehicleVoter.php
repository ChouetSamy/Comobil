<?php

namespace App\Security\Voter;

use App\Entity\User;
use App\Entity\Vehicle;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

final class VehicleVoter extends Voter
{
    public const VIEW = 'VEHICLE_VIEW';
    public const EDIT = 'VEHICLE_EDIT';
    public const DELETE = 'VEHICLE_DELETE';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return $subject instanceof Vehicle
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

        if (!$user instanceof User) {
            $vote?->addReason('The user must be authenticated.');

            return false;
        }

        // Accès global pour l'administration et la modération
        if (
            in_array('ROLE_ADMIN', $user->getRoles(), true)
            || in_array('ROLE_MODERATOR', $user->getRoles(), true)
        ) {
            return true;
        }

        /** @var Vehicle $vehicle */
        $vehicle = $subject;

        $fleet = $vehicle->getFleet();

        if ($fleet === null) {
            return false;
        }

        // Un véhicule appartient à l'utilisateur via :
        // Vehicle → Fleet → UserInfo → User
        $isOwner = $fleet->getUserInfo()?->getUser() === $user;

        return match ($attribute) {
            self::VIEW,
            self::EDIT,
            self::DELETE => $isOwner,

            default => false,
        };
    }
}