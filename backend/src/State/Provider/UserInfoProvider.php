<?php

namespace App\State\Provider;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\User;
use Symfony\Bundle\SecurityBundle\Security;

final class UserInfoProvider implements ProviderInterface
{
    public function __construct(
        private Security $security,
    ) {
    }

    public function provide(
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): object|array|null {
        $user = $this->security->getUser();


        if (!$user instanceof User) {
            return [];
        }

        $userInfo = $user->getUserInfo();

        return $userInfo !== null ? [$userInfo] : [];
    }
}