<?php

namespace App\Security\Voter;

use App\Entity\UserPreference;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserPreferenceVoter extends Voter
{
    public const VIEW = 'USER_PREFERENCE_VIEW';
    public const EDIT = 'USER_PREFERENCE_EDIT';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [
            self::VIEW,
            self::EDIT,
        ], true)
        && $subject instanceof UserPreference;
    }

    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
        ?Vote $vote = null
    ): bool {
        $user = $token->getUser();

        if (!$user instanceof UserInterface) {
            return false;
        }

        if (
            in_array('ROLE_ADMIN', $user->getRoles(), true)
            || in_array('ROLE_MODERATOR', $user->getRoles(), true)
        ) {
            return true;
        }

        /** @var UserPreference $userPreference */
        $userPreference = $subject;

        return $userPreference->getUserInfo()?->getUser() === $user;
    }
}