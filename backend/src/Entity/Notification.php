<?php

namespace App\Entity;

use App\Enum\Notification_Type;
use App\Repository\NotificationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: NotificationRepository::class)]
class Notification
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // CORRIGÉ : $receveir -> $receiver
    #[ORM\ManyToOne(inversedBy: 'notifications')]
    private ?User $receiver = null;

    // CORRIGÉ : $trips -> $trip (singulier)
    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    private ?Trip $trip = null;

    #[ORM\Column(length: 255)]
    private ?string $content = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $is_read = null;

    #[ORM\Column(enumType: Notification_Type::class, options: ['default' => 'PERSONNAL'])]
    private ?Notification_Type $notification_type = null;

    
    #[ORM\Column(nullable: false, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updated_at = null;

    public function __construct()
    {
        $this->created_at = new \DateTimeImmutable();
        $this->is_read = false; 
        $this->notification_type = Notification_Type::PERSONNAL;
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getTrip(): ?Trip
    {
        return $this->trip;
    }

    public function setTrip(?Trip $trip): static
    {
        $this->trip = $trip;
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

    public function getNotificationType(): ?Notification_Type
    {
        return $this->notification_type;
    }

    public function setNotificationType(Notification_Type $notification_type): static
    {
        $this->notification_type = $notification_type;
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