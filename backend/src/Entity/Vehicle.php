<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\Vehicle_State;
use App\Repository\VehicleRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('VEHICLE_VIEW', object)"
        ),
        new GetCollection(
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            security: "is_granted('ROLE_USER')"
        ),
        new Patch(
            security: "is_granted('VEHICLE_EDIT', object)"
        ),
        new Delete(
            security: "is_granted('VEHICLE_DELETE', object)"
        )
    ]
)]
#[ORM\HasLifecycleCallbacks]

#[ORM\Entity(repositoryClass: VehicleRepository::class)]
class Vehicle
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]

    private ?int $id = null;

    #[ORM\Column]
    #[Assert\NotNull(message: 'La présence de la climatisation est obligatoire.')]
    private ?bool $hasAc = null;

    #[ORM\Column(nullable: true)]
    #[Assert\PositiveOrZero(message: 'La consommation doit être positive ou nulle.')]
    private ?float $consumptionLiterPer100km = null;

    #[ORM\Column]
    #[Assert\NotNull(message: 'Le nombre de places est obligatoire.')]
    #[Assert\Positive(message: 'Le nombre de places doit être supérieur à 0.')]
    private ?int $seat = null;

    #[ORM\Column(enumType: Vehicle_State::class)]
    #[Assert\NotNull(message: 'L’état du véhicule est obligatoire.')]
    private ?Vehicle_State $vehicleState = null;

    #[ORM\ManyToOne(inversedBy: 'vehicles')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: 'La flotte est obligatoire.')]
    private ?Fleet $fleet = null;


    #[ORM\Column(length: 255, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $pictureUrl = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

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
        return $this->hasAc;
    }

    public function setHasAc(bool $hasAc): static
    {
        $this->hasAc = $hasAc;
        return $this;
    }

    public function getConsumptionLiterPer100km(): ?float
    {
        return $this->consumptionLiterPer100km;
    }

    public function setConsumptionLiterPer100km(?float $consumptionLiterPer100km): static
    {
        $this->consumptionLiterPer100km = $consumptionLiterPer100km;

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
        return $this->vehicleState;
    }

    public function setVehicleState(Vehicle_State $vehicleState): static
    {
        $this->vehicleState = $vehicleState;
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
        return $this->pictureUrl;
    }

    public function setPictureUrl(?string $pictureUrl): static
    {
        $this->pictureUrl = $pictureUrl;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTime $updatedAt): static
    {
        $this->updatedAt = $updatedAt;
        return $this;
    }
}