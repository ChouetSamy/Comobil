<?php

namespace App\State\Processor;

use App\Enum\Gender;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use App\Entity\UserInfo;
use App\Entity\UserPreference;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class UserPreferenceProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
    ) {}

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = [],
    ): mixed {
        if (!$data instanceof UserPreference) {
            return $data;
        }

        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException(
                'User must be authenticated.'
            );
        }

        $userInfo = $user->getUserInfo();

        // Create UserInfo automatically if it does not exist yet.
        if ($userInfo === null) {
            $userInfo = new UserInfo();
            $userInfo->setUser($user);

            $this->entityManager->persist($userInfo);
        }

        // Prevent modification of another user's preference.
        if (
            $data->getUserInfo() !== null
            && $data->getUserInfo() !== $userInfo
        ) {
            throw new AccessDeniedHttpException(
                'You cannot modify another user\'s preferences.'
            );
        }

        $data->setUserInfo($userInfo);

        $preference = $data->getPreference();

        if (
            $preference !== null
            && strtolower(str_replace(' ', '_', $preference->getDescription())) === 'women_only'
            && $data->isActive() === true
            && $user->getGender() !== Gender::FEMALE
        ) {
            throw new AccessDeniedHttpException(
                'Only female users can enable the women_only preference.'
            );
        }

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}
