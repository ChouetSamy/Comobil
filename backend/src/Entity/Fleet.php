<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\FleetRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Symfony\Component\Validator\Constraints as Assert;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: FleetRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('FLEET_VIEW', object)"
        ),
        new GetCollection(
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            security: "is_granted('ROLE_USER')"
        ),
        new Patch(
            security: "is_granted('FLEET_EDIT', object)"
        ),
        new Delete(
            security: "is_granted('FLEET_DELETE', object)"
        )
    ]
)]
class Fleet
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * Fleet est le côté inverse.
     * La relation est possédée par UserInfo.
     */
    #[ORM\OneToOne(
        mappedBy: 'fleet'
    )]
    private ?UserInfo $userInfo = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?Adress $adress = null;

    #[ORM\Column(length: 255, unique: true)]
    #[Assert\NotBlank(message: 'Le nom de la flotte est obligatoire.')]
    private ?string $name = null;

    #[ORM\ManyToOne(
        inversedBy: 'fleets'
    )]
    private ?MoralEntity $moralEntity = null;

    /**
     * @var Collection<int, Vehicle>
     */
    #[ORM\OneToMany(
        targetEntity: Vehicle::class,
        mappedBy: 'fleet',
        cascade: ['persist', 'remove'],
        orphanRemoval: true
    )]
    private Collection $vehicles;


    #[ORM\Column(
        length: 255,
        nullable: true
    )]
    private ?string $description = null;

    #[ORM\Column(
        nullable: false,
        options: ['default' => 'CURRENT_TIMESTAMP']
    )]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;


    public function __construct()
    {
        $this->vehicles = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }


    public function getId(): ?int
    {
        return $this->id;
    }


    public function getUserInfo(): ?UserInfo
    {
        return $this->userInfo;
    }

    public function setUserInfo(?UserInfo $userInfo): static
    {
        $this->userInfo = $userInfo;

        if (
            $userInfo !== null
            && $userInfo->getFleet() !== $this
        ) {
            $userInfo->setFleet($this);
        }

        return $this;
    }


    public function getMoralEntity(): ?MoralEntity
    {
        return $this->moralEntity;
    }

    public function setMoralEntity(
        ?MoralEntity $moralEntity
    ): static {
        $this->moralEntity = $moralEntity;

        return $this;
    }


    /**
     * @return Collection<int, Vehicle>
     */
    public function getVehicles(): Collection
    {
        return $this->vehicles;
    }

    public function addVehicle(
        Vehicle $vehicle
    ): static {
        if (!$this->vehicles->contains($vehicle)) {
            $this->vehicles->add($vehicle);
            $vehicle->setFleet($this);
        }

        return $this;
    }

    public function removeVehicle(
        Vehicle $vehicle
    ): static {
        if ($this->vehicles->removeElement($vehicle)) {
            if ($vehicle->getFleet() === $this) {
                $vehicle->setFleet(null);
            }
        }

        return $this;
    }


    public function getAdress(): ?Adress
    {
        return $this->adress;
    }

    public function setAdress(?Adress $adress): static
    {
        $this->adress = $adress;

        return $this;
    }


    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

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


    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(
        \DateTimeImmutable $createdAt
    ): static {
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