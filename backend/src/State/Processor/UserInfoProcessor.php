<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use App\Entity\User;
use App\Entity\UserInfo;
use Symfony\Bundle\SecurityBundle\Security;

final class UserInfoProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,

        #[Autowire(service: 'api_platform.doctrine.orm.state.persist_processor')]
        private ProcessorInterface $persistProcessor,
    ) {
    }

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): mixed {
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new \LogicException('User must be authenticated.');
        }

        if (!$data instanceof UserInfo) {
            throw new \LogicException('Invalid data type.');
        }

        // Un utilisateur normal ne peut modifier que son propre UserInfo
        if (
            !$this->security->isGranted('ROLE_ADMIN')
            && !$this->security->isGranted('ROLE_MODERATOR')
        ) {
            if (
                $data->getUser() !== null
                && $data->getUser() !== $user
            ) {
                throw new \Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException(
                    'You cannot modify another user\'s information.'
                );
            }

            // Lors de la création, association automatique avec l'utilisateur connecté
            if ($data->getUser() === null) {
                $data->setUser($user);
            }
        }

        return $this->persistProcessor->process(
            $data,
            $operation,
            $uriVariables,
            $context
        );
    }
}