<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\TripRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class TripHistoryController extends AbstractController
{
    #[Route(
        '/profile/trips',
        name: 'profile_trip_history',
        methods: ['GET']
    )]
    #[IsGranted('ROLE_USER')]
    public function history(
        TripRepository $tripRepository,
    ): JsonResponse {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'error' => 'Unauthorized',
            ], 401);
        }

        $upcoming =
            $tripRepository->findUpcomingTripsForUser(
                $user
            );

        $past =
            $tripRepository->findPastTripsForUser(
                $user
            );

        return $this->json([
            'upcoming' => array_map(
                fn ($trip) => $this->serializeTrip($trip),
                $upcoming
            ),

            'past' => array_map(
                fn ($trip) => $this->serializeTrip($trip),
                $past
            ),
        ]);
    }

    private function serializeTrip($trip): array
    {
        return [
            'id' => $trip->getId(),

            'departureDatetime' =>
                $trip
                    ->getDepartureDatetime()
                    ?->format(DATE_ATOM),

            'estimatedArrivalDatetime' =>
                $trip
                    ->getEstimatedArrivalDatetime()
                    ?->format(DATE_ATOM),

            'availableSeat' =>
                $trip->getAvailableSeat(),

            'pricePerPassenger' =>
                $trip->getPricePerPassenger(),

            'status' =>
                $trip->getTripStatus()?->value,

            'departure' => [
                'city' =>
                    $trip
                        ->getDepartureAddress()
                        ?->getCity(),
            ],

            'arrival' => [
                'city' =>
                    $trip
                        ->getArrivalAddress()
                        ?->getCity(),
            ],
        ];
    }
}