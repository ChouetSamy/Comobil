<?php

namespace App\Entity;

use App\Repository\CityRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CityRepository::class)]
class City
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $commune = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updated_at = null;

    /**
     * @var Collection<int, PostalCode>
     */
    #[ORM\OneToMany(targetEntity: PostalCode::class, mappedBy: 'city', orphanRemoval: true)] // CORRIGÉ : mappedBy: 'city'
    private Collection $postalCodes;

    public function __construct()
    {
        $this->postalCodes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCommune(): ?string
    {
        return $this->commune;
    }

    public function setCommune(string $commune): static
    {
        $this->commune = $commune;
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

    /**
     * @return Collection<int, PostalCode>
     */
    public function getPostalCodes(): Collection
    {
        return $this->postalCodes;
    }

    public function addPostalCode(PostalCode $postalCode): static
    {
        if (!$this->postalCodes->contains($postalCode)) {
            $this->postalCodes->add($postalCode);
            $postalCode->setCity($this); // CORRIGÉ : setCityId -> setCity
        }
        return $this;
    }

    public function removePostalCode(PostalCode $postalCode): static
    {
        if ($this->postalCodes->removeElement($postalCode)) {
            if ($postalCode->getCity() === $this) { // CORRIGÉ : getCityId -> getCity
                $postalCode->setCity(null);
            }
        }
        return $this;
    }
}