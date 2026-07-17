<?php

namespace App\EventListener;

use App\Repository\UserRepository;
use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTDecodedEvent;

class JwtDecodedListener
{
    public function __construct(
        private UserRepository $userRepository
    ) {
    }

    public function onJWTDecoded(JWTDecodedEvent $event): void
    {
        $payload = $event->getPayload();

        if (
            !isset($payload['username']) ||
            !isset($payload['token_version'])
        ) {
            $event->markAsInvalid();

            return;
        }

        $user = $this->userRepository->findOneBy([
            'email' => $payload['username']
        ]);

        if (!$user) {
            $event->markAsInvalid();

            return;
        }

        if (
            $user->getTokenVersion()
            !== $payload['token_version']
        ) {
            $event->markAsInvalid();
        }
    }
}