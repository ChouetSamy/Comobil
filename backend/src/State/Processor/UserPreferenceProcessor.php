<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\UserPreference;
use Symfony\Bundle\SecurityBundle\Security;
use Doctrine\ORM\EntityManagerInterface;

final class UserPreferenceProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): mixed {
        if (!$data instanceof UserPreference) {
            return $data;
        }

        $user = $this->security->getUser();

        if ($user === null) {
            return $data;
        }

        $userInfo = $data->getUserInfo();

        if (
            $userInfo !== null
            && $userInfo->getUser() !== $user
        ) {
            throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException(
                'You cannot modify another user\'s preferences.'
            );
        }

        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}