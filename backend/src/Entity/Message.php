<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;


#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER')"),
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_USER')")
    ]
)]
#[ORM\HasLifecycleCallbacks]

#[ORM\Entity(repositoryClass: MessageRepository::class)]
class Message
{

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'sentMessages')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $sender = null;

    // CORRIGÉ : $receveir -> $receiver, et inversedBy doit correspondre au nom de la propriété dans User
    #[ORM\ManyToOne(inversedBy: 'receivedMessages')]
    private ?User $receiver = null;

    #[ORM\Column(length: 255)]
    private ?string $content = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $isRead = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $isReported = null;

    #[ORM\Column(nullable: false, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $deletedAt = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    private ?Group $group = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    private ?Trip $trip = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->isRead = false;
        $this->isReported = false;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getSender(): ?User
    {
        return $this->sender;
    }

    public function setSender(?User $sender): static
    {
        $this->sender = $sender;
        return $this;
    }

    public function getReceiver(): ?User
    {
        return $this->receiver;
    }

    public function setReceiver(?User $receiver): static
    {
        $this->receiver = $receiver;
        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;
        return $this;
    }

    public function isRead(): ?bool
    {
        return $this->isRead;
    }

    public function setIsRead(bool $isRead): static
    {
        $this->isRead = $isRead;
        return $this;
    }

    public function isReported(): ?bool
    {
        return $this->isReported;
    }

    public function setIsReported(bool $isReported): static
    {
        $this->isReported = $isReported;
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

    public function getDeletedAt(): ?\DateTime
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTime $deletedAt): static
    {
        $this->deletedAt = $deletedAt;
        return $this;
    }

    public function getGroup(): ?Group // CORRIGÉ : getGroups -> getGroup
    {
        return $this->group;
    }

    public function setGroup(?Group $group): static // CORRIGÉ : setGroups -> setGroup
    {
        $this->group = $group;
        return $this;
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
}