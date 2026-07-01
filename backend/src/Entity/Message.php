<?php

namespace App\Entity;

use App\Repository\MessageRepository;
use Doctrine\ORM\Mapping as ORM;

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
    private ?bool $is_read = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $is_reported = null;

    #[ORM\Column(nullable: false, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updated_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $deleted_at = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    private ?Group $group = null;

    #[ORM\ManyToOne(inversedBy: 'messages')]
    private ?Trip $trip = null;

    public function __construct()
    {
         $this->created_at = new \DateTimeImmutable();
         $this->is_read = false;
         $this->is_reported = false;
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
        return $this->is_read;
    }

    public function setIsRead(bool $is_read): static
    {
        $this->is_read = $is_read;
        return $this;
    }

    public function isReported(): ?bool
    {
        return $this->is_reported;
    }

    public function setIsReported(bool $is_reported): static
    {
        $this->is_reported = $is_reported;
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

    public function getDeletedAt(): ?\DateTime
    {
        return $this->deleted_at;
    }

    public function setDeletedAt(?\DateTime $deleted_at): static
    {
        $this->deleted_at = $deleted_at;
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