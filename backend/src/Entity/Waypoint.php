<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\WaypointRepository;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(operations: [
    new Get(security: "is_granted('ROLE_USER')"),
    new GetCollection(security: "is_granted('ROLE_USER')"),
    new Post(security: "is_granted('ROLE_USER')"),
    new Patch(security: "is_granted('ROLE_USER')"),
    new Delete(security: "is_granted('ROLE_USER')")
])]
#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: WaypointRepository::class)]
class Waypoint
{    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'waypoints')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Trip $trip = null;

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Adress $address = null;

    #[ORM\Column]
    private ?\DateTime $estimated_at = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

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

    public function getAddress(): ?Adress
    {
        return $this->address;
    }

    public function setAddress(Adress $address): static
    {
        $this->address = $address;

        return $this;
    }

    public function getEstimatedAt(): ?\DateTime
    {
        return $this->estimated_at;
    }

    public function setEstimatedAt(\DateTime $estimated_at): static
    {
        $this->estimated_at = $estimated_at;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(string $description): static
    {
        $this->description = $description;

        return $this;
    }
}
