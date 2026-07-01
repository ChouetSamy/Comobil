<?php

namespace App\Entity;

use App\Repository\TripPreferenceRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TripPreferenceRepository::class)]
class TripPreference
{
    #[ORM\Id]
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
    private ?bool $is_active = true;

    public function __construct()
    {
        $this->is_active = true;
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
        return $this->is_active;
    }

    public function setIsActive(bool $is_active): static
    {
        $this->is_active = $is_active;
        return $this;
    }
}