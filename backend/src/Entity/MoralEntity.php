<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Repository\MoralEntityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER')"),
        new GetCollection(security: "is_granted('ROLE_USER')"),
        new Post(security: "is_granted('ROLE_MORAL_USER') or is_granted('ROLE_ADMIN') or is_granted('ROLE_MODERATOR')"),
        new Patch(security: "is_granted('ROLE_MORAL_USER') or is_granted('ROLE_ADMIN') or is_granted('ROLE_MODERATOR')"),
        new Delete(security: "is_granted('ROLE_MORAL_USER') or is_granted('ROLE_ADMIN') or is_granted('ROLE_MODERATOR')")
    ]
)]
#[ORM\HasLifecycleCallbacks]

#[ORM\Entity(repositoryClass: MoralEntityRepository::class)]
class MoralEntity
{    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;
    

    /**
     * @var Collection<int, User>
     */
    #[ORM\ManyToMany(targetEntity: User::class, inversedBy: 'moralEntities')]
    private Collection $users; // CORRIGÉ : $user_id -> $users

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Adress $address = null; // CORRIGÉ : $adress_id -> $address

    #[ORM\Column]
    private ?int $siret = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $phone = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $deletedAt = null;

    /**
     * @var Collection<int, Fleet>
     */
    #[ORM\OneToMany(targetEntity: Fleet::class, mappedBy: 'moralEntity')]
    private Collection $fleets;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    public function __construct()
    {
        $this->users = new ArrayCollection(); // CORRIGÉ : user_id -> users
        $this->fleets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    /**
     * @return Collection<int, User>
     */
    public function getUsers(): Collection // CORRIGÉ : getUserId -> getUsers
    {
        return $this->users;
    }

    public function addUser(User $user): static // CORRIGÉ : addUserId -> addUser
    {
        if (!$this->users->contains($user)) {
            $this->users->add($user);
        }
        return $this;
    }

    public function removeUser(User $user): static // CORRIGÉ : removeUserId -> removeUser
    {
        $this->users->removeElement($user);
        return $this;
    }

    public function getAddress(): ?Adress // CORRIGÉ : getAdressId -> getAddress
    {
        return $this->address;
    }

    public function setAddress(Adress $address): static // CORRIGÉ : setAdressId -> setAddress
    {
        $this->address = $address;
        return $this;
    }

    public function getSiret(): ?int
    {
        return $this->siret;
    }

    public function setSiret(int $siret): static
    {
        $this->siret = $siret;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;
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

    /**
     * @return Collection<int, Fleet>
     */
    public function getFleets(): Collection
    {
        return $this->fleets;
    }

    public function addFleet(Fleet $fleet): static
    {
        if (!$this->fleets->contains($fleet)) {
            $this->fleets->add($fleet);
            $fleet->setMoralEntity($this);
        }
        return $this;
    }

    public function removeFleet(Fleet $fleet): static
    {
        if ($this->fleets->removeElement($fleet)) {
            if ($fleet->getMoralEntity() === $this) {
                $fleet->setMoralEntity(null);
            }
        }
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
}