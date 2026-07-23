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
    private ?string $picture_url = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $bio = null;

    #[ORM\Column(options: ['default' => false])]
    private ?bool $accept_call = null;

    #[ORM\Column(
        nullable: true,
        options: ['default' => 0]
    )]
    private ?float $average_rating = null;

    #[ORM\Column(
        nullable: false,
        options: ['default' => 'CURRENT_TIMESTAMP']
    )]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updated_at = null;

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
        $this->accept_call = false;
        $this->average_rating = 0.0;
        $this->created_at = new \DateTimeImmutable();
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
        return $this->picture_url;
    }

    public function setPictureUrl(?string $picture_url): static
    {
        $this->picture_url = $picture_url;

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
        return $this->accept_call;
    }

    public function setAcceptCall(bool $accept_call): static
    {
        $this->accept_call = $accept_call;

        return $this;
    }


    public function getAverageRating(): ?float
    {
        return $this->average_rating;
    }

    public function setAverageRating(?float $average_rating): static
    {
        $this->average_rating = $average_rating;

        return $this;
    }


    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(
        \DateTimeImmutable $created_at
    ): static {
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