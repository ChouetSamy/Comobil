<?php

namespace App\Entity;

use App\Repository\TripPreferenceRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('TRIP_PREFERENCE_VIEW', object)"
        ),
        new GetCollection(
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            security: "is_granted('ROLE_USER')"
        ),
        new Patch(
            security: "is_granted('TRIP_PREFERENCE_EDIT', object)"
        ),
        new Delete(
            security: "is_granted('TRIP_PREFERENCE_EDIT', object)"
        )
    ]
)]

#[ORM\HasLifecycleCallbacks]

#[ORM\Entity(repositoryClass: TripPreferenceRepository::class)]
class TripPreference
{    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // CORRIGÉ : Le nom de la propriété est '$trip' (minuscule) pour correspondre au mappedBy de Trip
    #[ORM\ManyToOne(inversedBy: 'tripPreferences')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Trip $trip = null;

    // CORRIGÉ : Le nom de la propriété est '$preference' (singulier)
    #[ORM\ManyToOne(inversedBy: 'tripPreferences')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Preference $preference = null;

    #[ORM\Column(options: ['default' => true])]
    private ?bool $isActive = true;

    public function __construct()
    {
        $this->isActive = true;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    // Getter/Setter pour Trip (CORRIGÉ)
    public function getTrip(): ?Trip
    {
        return $this->trip;
    }

    public function setTrip(?Trip $trip): static
    {
        $this->trip = $trip;
        return $this;
    }

    // Getter/Setter pour Preference (CORRIGÉ)
    public function getPreference(): ?Preference
    {
        return $this->preference;
    }

    public function setPreference(?Preference $preference): static
    {
        $this->preference = $preference;
        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;
        return $this;
    }
}