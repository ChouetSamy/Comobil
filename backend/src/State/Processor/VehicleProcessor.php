<?php

namespace App\State\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\UserInfo;
use App\Entity\Fleet;
use App\Entity\User;
use App\Entity\Vehicle;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

final class VehicleProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,

        #[Autowire(
            service: 'api_platform.doctrine.orm.state.persist_processor'
        )]
        private ProcessorInterface $persistProcessor,
    ) {}

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = [],
    ): mixed {
        /** @var User|null $user */
        $user = $this->security->getUser();

        if (!$user instanceof User) {
            throw new AccessDeniedHttpException(
                'User must be authenticated.'
            );
        }

        if (!$data instanceof Vehicle) {
            throw new \LogicException(
                'Invalid data type.'
            );
        }

        $userInfo = $user->getUserInfo();

        $userInfo = $user->getUserInfo();

        if ($userInfo === null) {
            $userInfo = new UserInfo();
            $userInfo->setUser($user);
        }

        $fleet = $userInfo->getFleet();

        /*
         * Create the personal fleet automatically when
         * the user adds their first vehicle.
         */
        if ($fleet === null) {
            $fleet = new Fleet();

            $fleet
                ->setName(
                    sprintf(
                        'Personal fleet - user %d',
                        $user->getId()
                    )
                )
                ->setDescription('Personal vehicle fleet');

            $userInfo->setFleet($fleet);
        }

        /*
         * Prevent a regular user from assigning a vehicle
         * to another user's fleet.
         */
        if (
            $data->getFleet() !== null
            && $data->getFleet() !== $fleet
            && !$this->security->isGranted('ROLE_ADMIN')
            && !$this->security->isGranted('ROLE_MODERATOR')
        ) {
            throw new AccessDeniedHttpException(
                'You cannot add a vehicle to another user\'s fleet.'
            );
        }

        $data->setFleet($fleet);

        return $this->persistProcessor->process(
            $data,
            $operation,
            $uriVariables,
            $context,
        );
    }
}
