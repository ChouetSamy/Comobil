<?php

namespace App\DataFixtures;

use App\Entity\Adress;
use App\Entity\City;
use App\Entity\Preference;
use App\Entity\Trip;
use App\Entity\TripPreference;
use App\Entity\Traveler;
use App\Entity\User;
use App\Enum\Gender;
use App\Enum\Traveler_Role;
use App\Enum\Traveler_Status;
use App\Enum\Trip_Creator_Role;
use App\Enum\Trip_Status;
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
        // Users
        $driver = (new User())
            ->setEmail('driver@comobil.local')
            ->setRoles(['ROLE_USER'])
            ->setGender(Gender::MALE);

        $driver->setPassword(
            $this->passwordHasher->hashPassword(
                $driver,
                'Test1234!'
            )
        );

        $passenger = (new User())
            ->setEmail('female@comobil.local')
            ->setRoles(['ROLE_USER'])
            ->setGender(Gender::FEMALE);

        $passenger->setPassword(
            $this->passwordHasher->hashPassword(
                $passenger,
                'Test1234!'
            )
        );

        // Cities
        $toulouse = (new City())
            ->setCommune('Toulouse')
            ->setCreatedAt(new \DateTimeImmutable());

        $albi = (new City())
            ->setCommune('Albi')
            ->setCreatedAt(new \DateTimeImmutable());

        // Addresses
        $departureAddress = (new Adress())
            ->setCity($toulouse)
            ->setStreet('Gare Matabiau');

        $arrivalAddress = (new Adress())
            ->setCity($albi)
            ->setStreet('Place du Vigan');

        // Preferences
        $womenOnly = (new Preference())
            ->setDescription('women_only');

        $quietTrip = (new Preference())
            ->setDescription('no_talk');

        // Published trip
        $trip = (new Trip())
            ->setCreator($driver)
            ->setDepartureAddress($departureAddress)
            ->setArrivalAddress($arrivalAddress)
            ->setDepartureDatetime(
                new \DateTime('2026-09-07 08:00:00')
            )
            ->setEstimatedArrivalDatetime(
                new \DateTime('2026-09-07 09:30:00')
            )
            ->setTotalPrice(20)
            ->setPricePerPassenger(10)
            ->setAvailableSeats(2)
            ->setAverageRating(0)
            ->setTripCreatorRole(Trip_Creator_Role::DRIVER)
            ->setTripStatus(Trip_Status::PUBLISHED);

        // Active trip preference
        $tripPreference = (new TripPreference())
            ->setTrip($trip)
            ->setPreference($quietTrip)
            ->setIsActive(true);

        // Passenger
        $traveler = (new Traveler())
            ->setTrip($trip)
            ->setUser($passenger)
            ->setTravelerRole(Traveler_Role::PASSENGER)
            ->setTravelerStatus(Traveler_Status::PENDING);

        foreach ([
            $driver,
            $passenger,
            $toulouse,
            $albi,
            $departureAddress,
            $arrivalAddress,
            $womenOnly,
            $quietTrip,
            $trip,
            $tripPreference,
            $traveler,
        ] as $entity) {
            $manager->persist($entity);
        }

        $manager->flush();
    }
}