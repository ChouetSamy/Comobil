<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\Traveler_Role;
use App\Enum\Traveler_Status;
use App\Repository\TravelerRepository;
use App\State\Processor\TravelerProcessor;
use App\State\Processor\TravelerExclusionProcessor;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(operations: [
    new Get(security: "is_granted('ROLE_USER')"),
    new GetCollection(security: "is_granted('ROLE_USER')"),
    new Post(
        security: "is_granted('ROLE_USER')",
        processor: TravelerProcessor::class
    ),
    new Post(
        uriTemplate: '/travelers/{id}/exclude',
        uriVariables: ['id'],
        security: "is_granted('ROLE_USER')",
        processor: TravelerExclusionProcessor::class
    ),
    new Patch(
        uriTemplate: '/travelers/{id}/exclude',
        uriVariables: ['id'],
        security: "is_granted('ROLE_USER')",
        processor: TravelerExclusionProcessor::class,
    ),
    new Patch(security: "is_granted('ROLE_USER')"),
    new Delete(security: "is_granted('ROLE_USER')")
])]
#[ORM\HasLifecycleCallbacks]

#[ORM\Entity(repositoryClass: TravelerRepository::class)]
class Traveler
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[Assert\NotNull]
    #[ORM\ManyToOne(inversedBy: 'travelers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Trip $trip = null;


    #[ORM\ManyToOne(inversedBy: 'travelers')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[Assert\NotNull]
    #[ORM\Column(enumType: Traveler_Role::class)]
    private ?Traveler_Role $travelerRole = null;

    #[Assert\NotNull]
    #[ORM\Column(enumType: Traveler_Status::class, options: ['default' => 'PENDING'])]
    private ?Traveler_Status $travelerStatus = null;

    #[Assert\NotNull]
    #[ORM\Column]
    private ?\DateTime $joinedAt = null;

    public function __construct()
    {
        $this->travelerStatus = Traveler_Status::PENDING;
        $this->joinedAt = new \DateTime();
    }

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
        return $this->travelerRole;
    }

    public function setTravelerRole(Traveler_Role $travelerRole): static
    {
        $this->travelerRole = $travelerRole;

        return $this;
    }

    public function getTravelerStatus(): ?Traveler_Status
    {
        return $this->travelerStatus;
    }

    public function setTravelerStatus(Traveler_Status $travelerStatus): static
    {
        $this->travelerStatus = $travelerStatus;

        return $this;
    }

    public function getJoinedAt(): ?\DateTime
    {
        return $this->joinedAt;
    }

    public function setJoinedAt(\DateTime $joinedAt): static
    {
        $this->joinedAt = $joinedAt;

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
