<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\ReviewRepository;
use App\Repository\UserPreferenceRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class PublicProfileController extends AbstractController
{
    #[Route(
        '/api/public-profile/{id}',
        name: 'public_profile_show',
        methods: ['GET']
    )]
    #[IsGranted('ROLE_USER')]
    public function show(
        User $user,
        ReviewRepository $reviewRepository,
        UserPreferenceRepository $userPreferenceRepository,
    ): JsonResponse {
        if ($user->getDeletedAt() !== null) {
            return $this->json([
                'error' => 'User not found.',
            ], 404);
        }

        $userInfo = $user->getUserInfo();

        $fleet = $userInfo?->getFleet();

        $vehicle = null;

        if ($fleet !== null) {
            /*
             * MVP :
             * on affiche le premier véhicule de la flotte.
             */
            $vehicle = $fleet
                ->getVehicles()
                ->first();

            if ($vehicle === false) {
                $vehicle = null;
            }
        }

        /*
         * Préférences du profil.
         */
        $userPreferences = [];

        if ($userInfo !== null) {
            $userPreferences =
                $userPreferenceRepository->findBy([
                    'userInfo' => $userInfo,
                ]);
        }

        /*
         * Avis reçus par cet utilisateur.
         */
        $reviews =
            $reviewRepository->findBy(
                [
                    'reviewed' => $user,
                    'deletedAt' => null,
                ],
                [
                    'createdAt' => 'DESC',
                ]
            );

        return $this->json([
            'user' => [
                'id' => $user->getId(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'phone' => $user->getPhone(),
                'gender' => $user->getGender()?->value,
            ],

            'userInfo' => $userInfo !== null
                ? [
                    'id' => $userInfo->getId(),
                    'pictureUrl' => $userInfo->getPictureUrl(),
                    'bio' => $userInfo->getBio(),
                    'acceptCall' => $userInfo->isAcceptCall(),
                    'averageRating' => $userInfo->getAverageRating(),
                ]
                : null,

            'vehicle' => $vehicle !== null
                ? [
                    'id' => $vehicle->getId(),
                    'pictureUrl' => $vehicle->getPictureUrl(),
                    'seat' => $vehicle->getSeat(),
                    'hasAc' => $vehicle->hasAc(),
                    'consumptionLiterPer100km' =>
                    $vehicle->getConsumptionLiterPer100km(),
                    'vehicleState' =>
                    $vehicle->getVehicleState()?->value,
                    'description' =>
                    $vehicle->getDescription(),
                ]
                : null,

            'preferences' => array_map(
                static function ($userPreference): array {
                    return [
                        'id' => $userPreference->getId(),
                        'active' => $userPreference->isActive(),
                        'preference' => [
                            'id' =>
                            $userPreference
                                ->getPreference()
                                ?->getId(),

                            'description' =>
                            $userPreference
                                ->getPreference()
                                ?->getDescription(),
                        ],
                    ];
                },
                $userPreferences
            ),

            'reviews' => array_map(
                static function ($review): array {
                    $author =
                        $review->getAuthor();

                    $authorInfo =
                        $author?->getUserInfo();

                    return [
                        'id' => $review->getId(),

                        'comment' =>
                        $review->getComment(),

                        'createdAt' =>
                        $review
                            ->getCreatedAt()
                            ?->format(DATE_ATOM),

                        'author' => $author !== null
                            ? [
                                'id' =>
                                $author->getId(),

                                'firstName' =>
                                $author->getFirstName(),

                                'lastName' =>
                                $author->getLastName(),

                                'pictureUrl' =>
                                $authorInfo
                                    ?->getPictureUrl(),

                                'averageRating' =>
                                $authorInfo
                                    ?->getAverageRating(),
                            ]
                            : null,
                    ];
                },
                $reviews
            ),
        ]);
    }
}
