<?php

namespace App\DataFixtures;

use App\Entity\Adress;
use App\Entity\City;
use App\Entity\Fleet;
use App\Entity\Preference;
use App\Entity\Review;
use App\Entity\Traveler;
use App\Entity\Trip;
use App\Entity\TripPreference;
use App\Entity\User;
use App\Entity\UserInfo;
use App\Entity\UserPreference;
use App\Entity\Vehicle;
use App\Enum\Gender;
use App\Enum\Traveler_Role;
use App\Enum\Traveler_Status;
use App\Enum\Trip_Creator_Role;
use App\Enum\Trip_Status;
use App\Enum\Vehicle_State;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

final class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function load(ObjectManager $manager): void
    {
        /*
         * =====================================================
         * PREFERENCES
         * =====================================================
         */

        $preferences = [];

        foreach (
            [
                'women_only',
                'seek_conductor',
                'smoking',
                'animal',
                'no_music',
                'no_talk',
            ] as $description
        ) {
            $preference = new Preference();

            $preference->setDescription(
                $description
            );

            $manager->persist(
                $preference
            );

            $preferences[
                $description
            ] = $preference;
        }

        /*
         * =====================================================
         * VILLES
         * =====================================================
         */

        $cities = [];

        foreach (
            [
                'Paris',
                'Toulouse',
                'Grenoble',
                'Lyon',
                'Strasbourg',
                'Bordeaux',
                'Marseille',
                'Lille',
                'Nantes',
                'Varsovie',
                'Bruxelles',
                'Genève',
            ] as $commune
        ) {
            $city = new City();

            $city->setCommune(
                $commune
            );

            $manager->persist(
                $city
            );

            $cities[
                $commune
            ] = $city;
        }

        /*
         * =====================================================
         * UTILISATEURS
         * 5 hommes / 5 femmes
         *
         * Mot de passe commun de démo :
         * Demo1234!
         * =====================================================
         */

        $usersData = [
            /*
             * HOMMES
             */
            [
                'key' => 'einstein',
                'firstName' => 'Albert',
                'lastName' => 'Einstein',
                'email' => 'albert@comobil.local',
                'phone' => '0600000001',
                'gender' => Gender::MALE,
                'bio' =>
                    'Physicien théoricien passionné par les longues discussions, les trains et les expériences de pensée.',
                'rating' => 4.9,
                'acceptCall' => true,
                'preferences' => [
                    'no_music',
                ],
            ],

            [
                'key' => 'godel',
                'firstName' => 'Kurt',
                'lastName' => 'Gödel',
                'email' => 'kurt@comobil.local',
                'phone' => '0600000002',
                'gender' => Gender::MALE,
                'bio' =>
                    'Logicien et mathématicien. Préfère les trajets calmes et les conversations structurées.',
                'rating' => 4.7,
                'acceptCall' => false,
                'preferences' => [
                    'no_music',
                    'no_talk',
                ],
            ],

            [
                'key' => 'bohr',
                'firstName' => 'Niels',
                'lastName' => 'Bohr',
                'email' => 'niels@comobil.local',
                'phone' => '0600000003',
                'gender' => Gender::MALE,
                'bio' =>
                    'Physicien intéressé par les échanges scientifiques et les discussions pendant le voyage.',
                'rating' => 4.8,
                'acceptCall' => true,
                'preferences' => [],
            ],

            [
                'key' => 'feynman',
                'firstName' => 'Richard',
                'lastName' => 'Feynman',
                'email' => 'richard@comobil.local',
                'phone' => '0600000004',
                'gender' => Gender::MALE,
                'bio' =>
                    'Curieux, enthousiaste et toujours prêt à raconter une anecdote de physique.',
                'rating' => 4.6,
                'acceptCall' => true,
                'preferences' => [
                    'animal',
                ],
            ],

            [
                'key' => 'tesla',
                'firstName' => 'Nikola',
                'lastName' => 'Tesla',
                'email' => 'nikola@comobil.local',
                'phone' => '0600000005',
                'gender' => Gender::MALE,
                'bio' =>
                    'Inventeur et ingénieur. Amateur de technologie et de trajets silencieux.',
                'rating' => 4.5,
                'acceptCall' => false,
                'preferences' => [
                    'no_music',
                ],
            ],

            /*
             * FEMMES
             */
            [
                'key' => 'curie',
                'firstName' => 'Marie',
                'lastName' => 'Curie',
                'email' => 'marie@comobil.local',
                'phone' => '0600000006',
                'gender' => Gender::FEMALE,
                'bio' =>
                    'Physicienne et chimiste. Apprécie les trajets simples, ponctuels et efficaces.',
                'rating' => 5.0,
                'acceptCall' => true,
                'preferences' => [
                    'women_only',
                    'no_music',
                ],
            ],

            [
                'key' => 'johnson',
                'firstName' => 'Katherine',
                'lastName' => 'Johnson',
                'email' => 'katherine@comobil.local',
                'phone' => '0600000007',
                'gender' => Gender::FEMALE,
                'bio' =>
                    'Mathématicienne passionnée par l’aérospatiale, les trajectoires et la précision.',
                'rating' => 4.9,
                'acceptCall' => true,
                'preferences' => [
                    'women_only',
                ],
            ],

            [
                'key' => 'lamarr',
                'firstName' => 'Hedy',
                'lastName' => 'Lamarr',
                'email' => 'hedy@comobil.local',
                'phone' => '0600000008',
                'gender' => Gender::FEMALE,
                'bio' =>
                    'Actrice et inventrice, passionnée par les télécommunications et les nouvelles technologies.',
                'rating' => 4.8,
                'acceptCall' => true,
                'preferences' => [
                    'women_only',
                ],
            ],

            [
                'key' => 'meitner',
                'firstName' => 'Lise',
                'lastName' => 'Meitner',
                'email' => 'lise@comobil.local',
                'phone' => '0600000009',
                'gender' => Gender::FEMALE,
                'bio' =>
                    'Physicienne, discrète et intéressée par les voyages calmes.',
                'rating' => 4.7,
                'acceptCall' => false,
                'preferences' => [
                    'women_only',
                    'no_talk',
                ],
            ],

            [
                'key' => 'wu',
                'firstName' => 'Chien-Shiung',
                'lastName' => 'Wu',
                'email' => 'wu@comobil.local',
                'phone' => '0600000010',
                'gender' => Gender::FEMALE,
                'bio' =>
                    'Physicienne expérimentale, méthodique et ponctuelle.',
                'rating' => 4.9,
                'acceptCall' => true,
                'preferences' => [
                    'women_only',
                    'no_music',
                ],
            ],
        ];

        $users = [];
        $vehicles = [];

        foreach (
            $usersData
            as $index => $data
        ) {
            /*
             * USER
             */
            $user = new User();

            $user
                ->setEmail(
                    $data['email']
                )
                ->setFirstName(
                    $data['firstName']
                )
                ->setLastName(
                    $data['lastName']
                )
                ->setPhone(
                    $data['phone']
                )
                ->setGender(
                    $data['gender']
                )
                ->setRoles([
                    'ROLE_USER',
                ]);

            $user->setPassword(
                $this
                    ->passwordHasher
                    ->hashPassword(
                        $user,
                        'Demo1234!'
                    )
            );

            /*
             * USER INFO
             */
            $userInfo =
                new UserInfo();

            $userInfo
                ->setUser(
                    $user
                )
                ->setBio(
                    $data['bio']
                )
                ->setAcceptCall(
                    $data[
                        'acceptCall'
                    ]
                )
                ->setAverageRating(
                    $data['rating']
                );

            /*
             * On laisse pictureUrl à null.
             *
             * Le frontend utilisera donc
             * conducteur.png / passager.png
             * et aucun vieux fichier uploadé
             * ne provoquera de 404.
             */
            $userInfo
                ->setPictureUrl(
                    null
                );

            /*
             * FLEET
             */
            $fleet =
                new Fleet();

            $fleet
                ->setName(
                    sprintf(
                        'Flotte de %s %s',
                        $data['firstName'],
                        $data['lastName']
                    )
                )
                ->setDescription(
                    'Flotte personnelle de démonstration.'
                );

            $userInfo->setFleet(
                $fleet
            );

            /*
             * VEHICLE
             *
             * Un véhicule par utilisateur
             * pour rendre les profils utiles
             * pendant la démo.
             */
            $vehicle =
                new Vehicle();

            $vehicle
                ->setHasAc(
                    $index % 3 !== 0
                )
                ->setConsumptionLiterPer100km(
                    4.8
                    + (($index % 5) * 0.5)
                )
                ->setSeat(
                    $index % 2 === 0
                        ? 5
                        : 4
                )
                ->setVehicleState(
                    match ($index % 4) {
                        0 =>
                            Vehicle_State::VERY_GOOD,

                        1 =>
                            Vehicle_State::GOOD,

                        2 =>
                            Vehicle_State::NEW,

                        default =>
                            Vehicle_State::GOOD,
                    }
                )
                ->setDescription(
                    match ($index % 4) {
                        0 =>
                            'Véhicule confortable et bien entretenu.',

                        1 =>
                            'Citadine pratique pour les trajets quotidiens.',

                        2 =>
                            'Véhicule récent avec un intérieur spacieux.',

                        default =>
                            'Véhicule fiable adapté aux longs trajets.',
                    }
                )
                ->setPictureUrl(
                    null
                );

            $fleet->addVehicle(
                $vehicle
            );

            /*
             * USER PREFERENCES
             */
            foreach (
                $data[
                    'preferences'
                ] as $description
            ) {
                $userPreference =
                    new UserPreference();

                $userPreference
                    ->setUserInfo(
                        $userInfo
                    )
                    ->setPreference(
                        $preferences[
                            $description
                        ]
                    )
                    ->setIsActive(
                        true
                    );

                $manager->persist(
                    $userPreference
                );
            }

            $manager->persist(
                $user
            );

            $manager->persist(
                $userInfo
            );

            $manager->persist(
                $fleet
            );

            $manager->persist(
                $vehicle
            );

            $users[
                $data['key']
            ] = $user;

            $vehicles[
                $data['key']
            ] = $vehicle;
        }

        /*
         * =====================================================
         * ADRESSES
         * =====================================================
         */

        $makeAddress =
            function (
                string $city,
                string $street
            ) use (
                $manager,
                $cities
            ): Adress {
                $address =
                    new Adress();

                $address
                    ->setCity(
                        $cities[$city]
                    )
                    ->setStreet(
                        $street
                    );

                $manager->persist(
                    $address
                );

                return $address;
            };

        /*
         * =====================================================
         * TRAJETS
         *
         * Tous après le 10 septembre 2026.
         * =====================================================
         */

        $tripsData = [
            [
                'creator' => 'einstein',
                'vehicle' => 'einstein',
                'departureCity' => 'Paris',
                'departureStreet' => 'Champs-Élysées',
                'arrivalCity' => 'Lyon',
                'arrivalStreet' => 'Place Bellecour',
                'departure' => '2026-09-12 08:00',
                'arrival' => '2026-09-12 13:00',
                'price' => 45.0,
                'seats' => 2,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => false,
            ],

            [
                'creator' => 'bohr',
                'vehicle' => 'bohr',
                'departureCity' => 'Toulouse',
                'departureStreet' => 'Place du Capitole',
                'arrivalCity' => 'Grenoble',
                'arrivalStreet' => 'Place Grenette',
                'departure' => '2026-09-14 09:30',
                'arrival' => '2026-09-14 15:00',
                'price' => 48.0,
                'seats' => 3,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => false,
            ],

            [
                'creator' => 'curie',
                'vehicle' => 'curie',
                'departureCity' => 'Paris',
                'departureStreet' => 'Rue Pierre et Marie Curie',
                'arrivalCity' => 'Strasbourg',
                'arrivalStreet' => 'Place Kléber',
                'departure' => '2026-09-16 07:45',
                'arrival' => '2026-09-16 13:30',
                'price' => 55.0,
                'seats' => 2,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => true,
            ],

            [
                'creator' => 'johnson',
                'vehicle' => 'johnson',
                'departureCity' => 'Lyon',
                'departureStreet' => 'Part-Dieu',
                'arrivalCity' => 'Marseille',
                'arrivalStreet' => 'Vieux-Port',
                'departure' => '2026-09-18 10:00',
                'arrival' => '2026-09-18 14:30',
                'price' => 38.0,
                'seats' => 2,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => true,
            ],

            [
                'creator' => 'lamarr',
                'vehicle' => 'lamarr',
                'departureCity' => 'Paris',
                'departureStreet' => 'Avenue de la République',
                'arrivalCity' => 'Bruxelles',
                'arrivalStreet' => 'Grand-Place',
                'departure' => '2026-09-20 14:00',
                'arrival' => '2026-09-20 18:00',
                'price' => 42.0,
                'seats' => 3,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => true,
            ],

            [
                'creator' => 'feynman',
                'vehicle' => 'feynman',
                'departureCity' => 'Bordeaux',
                'departureStreet' => 'Place de la Bourse',
                'arrivalCity' => 'Toulouse',
                'arrivalStreet' => 'Allées Jean Jaurès',
                'departure' => '2026-09-22 11:15',
                'arrival' => '2026-09-22 14:00',
                'price' => 30.0,
                'seats' => 2,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => false,
            ],

            [
                'creator' => 'godel',
                'vehicle' => null,
                'departureCity' => 'Grenoble',
                'departureStreet' => 'Gare de Grenoble',
                'arrivalCity' => 'Genève',
                'arrivalStreet' => 'Gare Cornavin',
                'departure' => '2026-09-24 08:30',
                'arrival' => '2026-09-24 11:00',
                'price' => 25.0,
                'seats' => 3,
                'role' => Trip_Creator_Role::PASSENGER,
                'womenOnly' => false,
                'seekDriver' => true,
            ],

            [
                'creator' => 'meitner',
                'vehicle' => 'meitner',
                'departureCity' => 'Strasbourg',
                'departureStreet' => 'Gare centrale',
                'arrivalCity' => 'Paris',
                'arrivalStreet' => 'Gare de l’Est',
                'departure' => '2026-09-27 09:00',
                'arrival' => '2026-09-27 14:00',
                'price' => 49.0,
                'seats' => 2,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => true,
            ],

            [
                'creator' => 'tesla',
                'vehicle' => 'tesla',
                'departureCity' => 'Nantes',
                'departureStreet' => 'Place Royale',
                'arrivalCity' => 'Paris',
                'arrivalStreet' => 'Montparnasse',
                'departure' => '2026-10-01 06:45',
                'arrival' => '2026-10-01 11:15',
                'price' => 44.0,
                'seats' => 3,
                'role' => Trip_Creator_Role::DRIVER,
                'womenOnly' => false,
            ],

            [
                'creator' => 'wu',
                'vehicle' => null,
                'departureCity' => 'Paris',
                'departureStreet' => 'Place d’Italie',
                'arrivalCity' => 'Varsovie',
                'arrivalStreet' => 'Nowy Świat',
                'departure' => '2026-10-04 07:00',
                'arrival' => '2026-10-05 01:00',
                'price' => 120.0,
                'seats' => 3,
                'role' => Trip_Creator_Role::PASSENGER,
                'womenOnly' => false,
                'seekDriver' => true,
            ],
        ];

        $trips = [];

        foreach (
            $tripsData
            as $index => $data
        ) {
            $departureAddress =
                $makeAddress(
                    $data[
                        'departureCity'
                    ],
                    $data[
                        'departureStreet'
                    ]
                );

            $arrivalAddress =
                $makeAddress(
                    $data[
                        'arrivalCity'
                    ],
                    $data[
                        'arrivalStreet'
                    ]
                );

            $trip =
                new Trip();

            $trip
                ->setCreator(
                    $users[
                        $data['creator']
                    ]
                )
                ->setDepartureAddress(
                    $departureAddress
                )
                ->setArrivalAddress(
                    $arrivalAddress
                )
                ->setDepartureDatetime(
                    new \DateTime(
                        $data[
                            'departure'
                        ]
                    )
                )
                ->setEstimatedArrivalDatetime(
                    new \DateTime(
                        $data[
                            'arrival'
                        ]
                    )
                )
                ->setTotalPrice(
                    $data['price']
                )
                ->setAvailableSeats(
                    $data['seats']
                )
                ->setTripCreatorRole(
                    $data['role']
                )
                ->setTripStatus(
                    Trip_Status::PUBLISHED
                )
                ->setAverageRating(
                    0
                );

            /*
             * Prix affiché actuellement.
             */
            $trip->setPricePerPassenger(
                round(
                    $data['price']
                    / max(
                        1,
                        $data['seats']
                    ),
                    2
                )
            );

            if (
                $data['vehicle']
                !== null
            ) {
                $trip->setVehicle(
                    $vehicles[
                        $data['vehicle']
                    ]
                );
            }

            /*
             * WOMEN ONLY
             */
            if (
                $data[
                    'womenOnly'
                ]
            ) {
                $tripPreference =
                    new TripPreference();

                $tripPreference
                    ->setTrip(
                        $trip
                    )
                    ->setPreference(
                        $preferences[
                            'women_only'
                        ]
                    )
                    ->setIsActive(
                        true
                    );

                $trip->addTripPreference(
                    $tripPreference
                );

                $manager->persist(
                    $tripPreference
                );
            }

            /*
             * SEEK DRIVER
             */
            if (
                $data[
                    'seekDriver'
                ]
                ?? false
            ) {
                $tripPreference =
                    new TripPreference();

                $tripPreference
                    ->setTrip(
                        $trip
                    )
                    ->setPreference(
                        $preferences[
                            'seek_conductor'
                        ]
                    )
                    ->setIsActive(
                        true
                    );

                $trip->addTripPreference(
                    $tripPreference
                );

                $manager->persist(
                    $tripPreference
                );
            }

            $manager->persist(
                $trip
            );

            $trips[$index] =
                $trip;
        }

        /*
         * =====================================================
         * VOYAGEURS
         *
         * Quelques trajets peuplés pour TripDetails.
         * Aucun homme dans les women_only.
         * =====================================================
         */

        $travelersData = [
            [
                'trip' => 0,
                'user' => 'bohr',
            ],
            [
                'trip' => 0,
                'user' => 'feynman',
            ],

            [
                'trip' => 1,
                'user' => 'einstein',
            ],

            /*
             * women_only
             */
            [
                'trip' => 2,
                'user' => 'johnson',
            ],
            [
                'trip' => 2,
                'user' => 'lamarr',
            ],

            /*
             * women_only
             */
            [
                'trip' => 3,
                'user' => 'curie',
            ],

            /*
             * women_only
             */
            [
                'trip' => 4,
                'user' => 'wu',
            ],

            [
                'trip' => 5,
                'user' => 'tesla',
            ],

            /*
             * women_only
             */
            [
                'trip' => 7,
                'user' => 'curie',
            ],

            [
                'trip' => 8,
                'user' => 'godel',
            ],
        ];

        foreach (
            $travelersData
            as $data
        ) {
            $traveler =
                new Traveler();

            $traveler
                ->setTrip(
                    $trips[
                        $data['trip']
                    ]
                )
                ->setUser(
                    $users[
                        $data['user']
                    ]
                )
                ->setTravelerRole(
                    Traveler_Role::PASSENGER
                )
                ->setTravelerStatus(
                    Traveler_Status::PENDING
                );

            $manager->persist(
                $traveler
            );
        }

        /*
         * =====================================================
         * AVIS
         *
         * Quelques exemples pour remplir Profile.
         * =====================================================
         */

        $reviewsData = [
            [
                'author' => 'bohr',
                'reviewed' => 'einstein',
                'trip' => 0,
                'comment' =>
                    'Très bon trajet, ponctuel et agréable.',
            ],

            [
                'author' => 'feynman',
                'reviewed' => 'einstein',
                'trip' => 0,
                'comment' =>
                    'Discussion passionnante pendant tout le voyage.',
            ],

            [
                'author' => 'johnson',
                'reviewed' => 'curie',
                'trip' => 2,
                'comment' =>
                    'Conduite très agréable et trajet parfaitement organisé.',
            ],

            [
                'author' => 'curie',
                'reviewed' => 'johnson',
                'trip' => 3,
                'comment' =>
                    'Ponctuelle, sympathique et très bonne conductrice.',
            ],

            [
                'author' => 'wu',
                'reviewed' => 'lamarr',
                'trip' => 4,
                'comment' =>
                    'Excellent trajet, confortable et convivial.',
            ],

            [
                'author' => 'tesla',
                'reviewed' => 'feynman',
                'trip' => 5,
                'comment' =>
                    'Trajet dynamique et conducteur très sympathique.',
            ],
        ];

        foreach (
            $reviewsData
            as $data
        ) {
            $review =
                new Review();

            $review
                ->setAuthor(
                    $users[
                        $data['author']
                    ]
                )
                ->setReviewed(
                    $users[
                        $data['reviewed']
                    ]
                )
                ->setTrip(
                    $trips[
                        $data['trip']
                    ]
                )
                ->setComment(
                    $data['comment']
                )
                ->setIsReported(
                    false
                );

            $manager->persist(
                $review
            );
        }

        /*
         * =====================================================
         * SAVE
         * =====================================================
         */

        $manager->flush();
    }
}