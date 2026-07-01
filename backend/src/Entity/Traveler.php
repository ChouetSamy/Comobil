<?php

namespace App\Entity;

use App\Enum\Traveler_Role;
use App\Enum\Traveler_Status;
use App\Repository\TravelerRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TravelerRepository::class)]
class Traveler
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'travelers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Trip $trip = null;

    #[ORM\ManyToOne(inversedBy: 'travelers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(enumType: Traveler_Role::class)]
    private ?Traveler_Role $traveler_role = null;

    #[ORM\Column(enumType: Traveler_Status::class, options: ['default' => 'PENDING'])]
    private ?Traveler_Status $traveler_status = null;

    #[ORM\Column]
    private ?\DateTime $joined_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTrip(): ?Trip
    {
        return $this->trip;
    }

    public function setTrip(?Trip $trip): static
    {
        $this->trip = $trip;

        return $this;
    }

    public function getTravelerRole(): ?Traveler_Role
    {
        return $this->traveler_role;
    }

    public function setTravelerRole(Traveler_Role $traveler_role): static
    {
        $this->traveler_role = $traveler_role;

        return $this;
    }

    public function getTravelerStatus(): ?Traveler_Status
    {
        return $this->traveler_status;
    }

    public function setTravelerStatus(Traveler_Status $traveler_status): static
    {
        $this->traveler_status = $traveler_status;

        return $this;
    }

    public function getJoinedAt(): ?\DateTime
    {
        return $this->joined_at;
    }

    public function setJoinedAt(\DateTime $joined_at): static
    {
        $this->joined_at = $joined_at;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }
}
