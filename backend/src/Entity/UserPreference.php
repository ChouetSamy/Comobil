<?php

namespace App\Entity;

use App\Repository\UserPreferenceRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\State\Processor\UserPreferenceProcessor;

#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('USER_PREFERENCE_VIEW', object)"
        ),
        new GetCollection(
            security: "is_granted('ROLE_USER')"
        ),
        new Post(
            processor: UserPreferenceProcessor::class,
            security: "is_granted('ROLE_USER')"
        ),
        new Patch(
            processor: UserPreferenceProcessor::class,
            security: "is_granted('USER_PREFERENCE_EDIT', object)"
        ),
        new Delete(
            security: "is_granted('USER_PREFERENCE_EDIT', object)"
        )
    ]
)]

#[ORM\HasLifecycleCallbacks]
#[ORM\Table(
    uniqueConstraints: [
        new ORM\UniqueConstraint(
            name: 'unique_user_info_preference',
            columns: ['user_info_id', 'preference_id']
        )
    ]
)]


#[ORM\Entity(repositoryClass: UserPreferenceRepository::class)]
class UserPreference
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    

    #[ORM\ManyToOne(inversedBy: 'userPreferences')]
    #[ORM\JoinColumn(nullable: false)]
    private ?UserInfo $userInfo = null;

    #[ORM\ManyToOne(inversedBy: 'userPreferences')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Preference $preference = null;

    #[ORM\Column(options: ['default' => true])]
    private ?bool $isActive = true;

    public function __construct()
    {
        $this->isActive = true;
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

        return $this;
    }

    public function getPreference(): ?Preference
    {
        return $this->preference;
    }

    public function setPreference(?Preference $preference): static
    {
        $this->preference = $preference;

        return $this;
    }

    public function isActive(): ?bool
    {
        return $this->isActive;
    }

    public function setIsActive(bool $isActive): static
    {
        $this->isActive = $isActive;

        return $this;
    }
}