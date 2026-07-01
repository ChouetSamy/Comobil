<?php

namespace App\Entity;

use App\Enum\Vehicle_State;
use App\Repository\VehicleRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VehicleRepository::class)]
class Vehicle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'vehicles')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Fleet $fleet = null; // CORRIGÉ : $fleet_id -> $fleet

    #[ORM\Column]
    private ?bool $has_ac = null;

    #[ORM\Column]
    private ?float $consumption_liter_per_100km = null;

    #[ORM\Column]
    private ?int $seat = null;

    #[ORM\Column(enumType: Vehicle_State::class)]
    private ?Vehicle_State $vehicle_state = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $picture_url = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updated_at = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getFleet(): ?Fleet // CORRIGÉ : getFleetId -> getFleet
    {
        return $this->fleet;
    }

    public function setFleet(?Fleet $fleet): static // CORRIGÉ : setFleetId -> setFleet
    {
        $this->fleet = $fleet;
        return $this;
    }

    public function hasAc(): ?bool
    {
        return $this->has_ac;
    }

    public function setHasAc(bool $has_ac): static
    {
        $this->has_ac = $has_ac;
        return $this;
    }

    public function getConsumptionLiterPer100km(): ?float
    {
        return $this->consumption_liter_per_100km;
    }

    public function setConsumptionLiterPer100km(float $consumption_liter_per_100km): static
    {
        $this->consumption_liter_per_100km = $consumption_liter_per_100km;
        return $this;
    }

    public function getSeat(): ?int
    {
        return $this->seat;
    }

    public function setSeat(int $seat): static
    {
        $this->seat = $seat;
        return $this;
    }

    public function getVehicleState(): ?Vehicle_State
    {
        return $this->vehicle_state;
    }

    public function setVehicleState(Vehicle_State $vehicle_state): static
    {
        $this->vehicle_state = $vehicle_state;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getPictureUrl(): ?string
    {
        return $this->picture_url;
    }

    public function setPictureUrl(?string $picture_url): static
    {
        $this->picture_url = $picture_url;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(?\DateTime $updated_at): static
    {
        $this->updated_at = $updated_at;
        return $this;
    }
}