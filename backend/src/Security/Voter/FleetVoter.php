<?php

namespace App\Security\Voter;

use App\Entity\Fleet;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\Authorization\Voter\Vote;
/**
 * Contrôle l'accès d'un utilisateur à une flotte.
 *
 * Une flotte utilisateur est liée à un UserInfo,
 * lui-même lié à un User.
 *
 * Le propriétaire de la flotte est donc :
 *
 * Fleet -> UserInfo -> User
 */
class FleetVoter extends Voter
{
    public const VIEW = 'FLEET_VIEW';
    public const EDIT = 'FLEET_EDIT';
    public const DELETE = 'FLEET_DELETE';

    public function __construct(
        private Security $security,
    ) {
    }

    /**
     * Vérifie si le voter sait gérer l'attribut et le sujet.
     */
    protected function supports(
        string $attribute,
        mixed $subject
    ): bool {
        return in_array($attribute, [
            self::VIEW,
            self::EDIT,
            self::DELETE,
        ], true)
            && $subject instanceof Fleet;
    }

    /**
     * Vérifie si l'utilisateur connecté possède les droits
     * sur la flotte concernée.
     */
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

        // Les administrateurs peuvent gérer toutes les flottes.
        if ($this->security->isGranted('ROLE_ADMIN')) {
            return true;
        }

        /** @var Fleet $fleet */
        $fleet = $subject;

        $userInfo = $fleet->getUserInfo();

        // Une flotte non liée à un UserInfo
        // ne peut pas être gérée par un utilisateur normal.
        if ($userInfo === null) {
            return false;
        }

        // Vérifie que la flotte appartient bien
        // à l'utilisateur connecté.
        if ($userInfo->getUser() !== $user) {
            return false;
        }

        return match ($attribute) {
            self::VIEW,
            self::EDIT,
            self::DELETE => true,

            default => false,
        };
    }
}