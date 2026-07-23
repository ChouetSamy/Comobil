<?php

namespace App\Security\Voter;

use App\Entity\UserInfo;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

final class UserInfoVoter extends Voter
{
    public const EDIT = 'USER_INFO_EDIT';
    public const VIEW = 'USER_INFO_VIEW';

    protected function supports(string $attribute, mixed $subject): bool
    {
        return in_array($attribute, [
            self::EDIT,
            self::VIEW,
        ], true)
        && $subject instanceof UserInfo;
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

        // Administration et modération : accès global
        if (
            in_array('ROLE_ADMIN', $user->getRoles(), true)
            || in_array('ROLE_MODERATOR', $user->getRoles(), true)
        ) {
            return true;
        }

        /** @var UserInfo $userInfo */
        $userInfo = $subject;

        // Un utilisateur ne peut accéder qu'à son propre UserInfo
        return $userInfo->getUser() === $user;
    }
}