<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\UserInfoRepository;
use App\State\Processor\UserInfoProcessor;
use App\State\Provider\UserInfoProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\HasLifecycleCallbacks]
#[ORM\Entity(repositoryClass: UserInfoRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('USER_INFO_VIEW', object)"
        ),
        new GetCollection(
            provider: UserInfoProvider::class
        ),
        new Post(
            processor: UserInfoProcessor::class,
            security: "is_granted('ROLE_USER')"
        ),
        new Patch(
            processor: UserInfoProcessor::class,
            security: "is_granted('USER_INFO_EDIT', object)"
        ),
        new Delete(
            security: "is_granted('USER_INFO_EDIT', object)"
        )
    ]
)]
class UserInfo
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    /**
     * UserInfo est le côté propriétaire de la relation.
     */
    #[ORM\OneToOne(
        inversedBy: 'userInfo',
        cascade: ['persist', 'remove']
    )]
    #[ORM\JoinColumn(nullable: true)]
    private ?User $user = null;

    /**
     * Une flotte personnelle peut être associée au profil.
     */
    #[ORM\OneToOne(
        inversedBy: 'userInfo',
        cascade: ['persist', 'remove']
    )]
    #[ORM\JoinColumn(nullable: true)]
    private ?Fleet $fleet = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $pictureUrl = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $acceptCall = null;

    #[ORM\Column(
        nullable: true,
        options: ['default' => 0]
    )]
    private ?float $averageRating = null;

    #[ORM\Column(
        nullable: false,
        options: ['default' => 'CURRENT_TIMESTAMP']
    )]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;

    /**
     * @var Collection<int, UserPreference>
     */
    #[ORM\OneToMany(
        targetEntity: UserPreference::class,
        mappedBy: 'userInfo'
    )]
    private Collection $userPreferences;


    public function __construct()
    {
        $this->userPreferences = new ArrayCollection();
        $this->acceptCall = false;
        $this->averageRating = 0.0;
        $this->createdAt = new \DateTimeImmutable();
    }


    public function getId(): ?int
    {
        return $this->id;
    }


    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        if (
            $user !== null
            && $user->getUserInfo() !== $this
        ) {
            $user->setUserInfo($this);
        }

        return $this;
    }


    public function getFleet(): ?Fleet
    {
        return $this->fleet;
    }

    public function setFleet(?Fleet $fleet): static
    {
        $this->fleet = $fleet;

        if (
            $fleet !== null
            && $fleet->getUserInfo() !== $this
        ) {
            $fleet->setUserInfo($this);
        }

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


    public function getBio(): ?string
    {
        return $this->bio;
    }

    public function setBio(?string $bio): static
    {
        $this->bio = $bio;

        return $this;
    }


    public function isAcceptCall(): ?bool
    {
        return $this->acceptCall;
    }

    public function setAcceptCall(bool $acceptCall): static
    {
        $this->acceptCall = $acceptCall;

        return $this;
    }


    public function getAverageRating(): ?float
    {
        return $this->averageRating;
    }

    public function setAverageRating(?float $averageRating): static
    {
        $this->averageRating = $averageRating;

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


    /**
     * @return Collection<int, UserPreference>
     */
    public function getUserPreferences(): Collection
    {
        return $this->userPreferences;
    }

    public function addUserPreference(
        UserPreference $userPreference
    ): static {
        if (!$this->userPreferences->contains($userPreference)) {
            $this->userPreferences->add($userPreference);
            $userPreference->setUserInfo($this);
        }

        return $this;
    }

    public function removeUserPreference(
        UserPreference $userPreference
    ): static {
        if ($this->userPreferences->removeElement($userPreference)) {
            if ($userPreference->getUserInfo() === $this) {
                $userPreference->setUserInfo(null);
            }
        }

        return $this;
    }
}