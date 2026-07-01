<?php

namespace App\Entity;

use App\Repository\PreferenceRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: PreferenceRepository::class)]
class Preference
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    /**
     * @var Collection<int, UserPreference>
     */
    #[ORM\OneToMany(targetEntity: UserPreference::class, mappedBy: 'preference')]
   
    private Collection $userPreferences;

    /**
     * @var Collection<int, TripPreference>
     */
    #[ORM\OneToMany(targetEntity: TripPreference::class, mappedBy: 'preference')]

    private Collection $tripPreferences;
    public function __construct()
    {
        $this->userPreferences = new ArrayCollection();
        $this->tripPreferences = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    /**
     * @return Collection<int, UserPreference>
     */
    public function getUserPreferences(): Collection
    {
        return $this->userPreferences;
    }

    public function addUserPreference(UserPreference $userPreference): static
    {
        if (!$this->userPreferences->contains($userPreference)) {
            $this->userPreferences->add($userPreference);
            $userPreference->setPreferences($this);
        }

        return $this;
    }

    public function removeUserPreference(UserPreference $userPreference): static
    {
        if ($this->userPreferences->removeElement($userPreference)) {
            // set the owning side to null (unless already changed)
            if ($userPreference->getPreferences() === $this) {
                $userPreference->setPreferences(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, TripPreference>
     */
    public function getTripPreferences(): Collection
    {
        return $this->tripPreferences;
    }

    public function addTripPreference(TripPreference $tripPreference): static
    {
        if (!$this->tripPreferences->contains($tripPreference)) {
            $this->tripPreferences->add($tripPreference);
            $tripPreference->setPreference($this);
        }

        return $this;
    }

    public function removeTripPreference(TripPreference $tripPreference): static
    {
        if ($this->tripPreferences->removeElement($tripPreference)) {
            // set the owning side to null (unless already changed)
            if ($tripPreference->getPreference() === $this) {
                $tripPreference->setPreference(null);
            }
        }

        return $this;
    }
}
