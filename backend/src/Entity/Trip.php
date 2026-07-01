<?php

namespace App\Entity;

use App\Enum\Trip_Creator_Role;
use App\Enum\Trip_Status;
use App\Repository\TripRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TripRepository::class)]
class Trip
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'trips')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $creator = null; 

    #[ORM\ManyToOne] 
    #[ORM\JoinColumn(nullable: false)]
    private ?Vehicle $vehicle = null; 

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Adress $departureAddress = null; 

    #[ORM\OneToOne(cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
    private ?Adress $arrivalAddress = null; 

    #[ORM\Column]
    private ?\DateTime $departure_datetime = null;

    #[ORM\Column]
    private ?\DateTime $estimated_arrival_datetime = null;

    #[ORM\Column]
    private ?int $total_seat = null;

    #[ORM\Column]
    private ?int $available_seat = null;

    #[ORM\Column]
    private ?float $total_price = null;

    #[ORM\Column]
    private ?float $price_per_passenger = null;

    #[ORM\Column]
    private ?float $average_rating = null;

    #[ORM\Column]
    private ?bool $is_women_only = null;

    #[ORM\Column(enumType: Trip_Status::class)]
    private ?Trip_Status $trip_status = null;

    /**
     * @var Collection<int, TripPreference>
     */
    #[ORM\OneToMany(targetEntity: TripPreference::class, mappedBy: 'trip')] 
    private Collection $tripPreferences;

    /**
     * @var Collection<int, Traveler>
     */
    #[ORM\OneToMany(targetEntity: Traveler::class, mappedBy: 'trip')]
    private Collection $travelers;

    #[ORM\Column(enumType: Trip_Creator_Role::class)]
    private ?Trip_Creator_Role $trip_creator_role = null;

    /**
     * @var Collection<int, Review>
     */
    #[ORM\OneToMany(targetEntity: Review::class, mappedBy: 'trip')]
    private Collection $reviews;

    /**
     * @var Collection<int, Waypoint>
     */
    #[ORM\OneToMany(targetEntity: Waypoint::class, mappedBy: 'trip', orphanRemoval: true)]
    private Collection $waypoints;

    #[ORM\Column(options: ['default' => 3])]
    private ?int $available_seats = 3;

    #[ORM\Column(enumType: Trip_Status::class, options: ['default' => 'PUBLISHED'])]
    private ?Trip_Status $trip_status_default = null;

    #[ORM\Column(nullable: false, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updated_at = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $deleted_at = null;

    public function __construct()
    {
        $this->tripPreferences = new ArrayCollection();
        $this->travelers = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->waypoints = new ArrayCollection();
        $this->available_seats = 3;
        $this->trip_status = Trip_Status::PUBLISHED;
        $this->is_women_only = false;
        $this->created_at = new \DateTimeImmutable();
    }

    // --- Getters et Setters (Mise à jour des noms) ---

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCreator(): ?User
    {
        return $this->creator;
    }

    public function setCreator(?User $creator): static
    {
        $this->creator = $creator;
        return $this;
    }

    public function getVehicle(): ?Vehicle
    {
        return $this->vehicle;
    }

    public function setVehicle(?Vehicle $vehicle): static
    {
        $this->vehicle = $vehicle;
        return $this;
    }

    public function getDepartureAddress(): ?Adress
    {
        return $this->departureAddress;
    }

    public function setDepartureAddress(Adress $departureAddress): static
    {
        $this->departureAddress = $departureAddress;
        return $this;
    }

    public function getArrivalAddress(): ?Adress
    {
        return $this->arrivalAddress;
    }

    public function setArrivalAddress(Adress $arrivalAddress): static
    {
        $this->arrivalAddress = $arrivalAddress;
        return $this;
    }


    public function getTripPreferences(): Collection
    {
        return $this->tripPreferences;
    }

    public function addTripPreference(TripPreference $tripPreference): static
    {
        if (!$this->tripPreferences->contains($tripPreference)) {
            $this->tripPreferences->add($tripPreference);
            $tripPreference->setTrip($this); // CORRIGÉ : setTripId -> setTrip
        }
        return $this;
    }

    public function removeTripPreference(TripPreference $tripPreference): static
    {
        if ($this->tripPreferences->removeElement($tripPreference)) {
            if ($tripPreference->getTrip() === $this) {
                $tripPreference->setTrip(null);
            }
        }
        return $this;
    }

    /**
     * @return Collection<int, Traveler>
     */
    public function getTravelers(): Collection
    {
        return $this->travelers;
    }

    public function addTraveler(Traveler $traveler): static
    {
        if (!$this->travelers->contains($traveler)) {
            $this->travelers->add($traveler);
            $traveler->setTrip($this);
        }

        return $this;
    }

    public function removeTraveler(Traveler $traveler): static
    {
        if ($this->travelers->removeElement($traveler)) {
            // set the owning side to null (unless already changed)
            if ($traveler->getTrip() === $this) {
                $traveler->setTrip(null);
            }
        }

        return $this;
    }

    public function getTripCreatorRole(): ?Trip_Creator_Role
    {
        return $this->trip_creator_role;
    }

    public function setTripCreatorRole(Trip_Creator_Role $trip_creator_role): static
    {
        $this->trip_creator_role = $trip_creator_role;

        return $this;
    }

    /**
     * @return Collection<int, Review>
     */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    public function addReview(Review $review): static
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setTrip($this);
        }

        return $this;
    }

    public function removeReview(Review $review): static
    {
        if ($this->reviews->removeElement($review)) {
            // set the owning side to null (unless already changed)
            if ($review->getTrip() === $this) {
                $review->setTrip(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Waypoint>
     */
    public function getWaypoints(): Collection
    {
        return $this->waypoints;
    }

    public function addWaypoint(Waypoint $waypoint): static
    {
        if (!$this->waypoints->contains($waypoint)) {
            $this->waypoints->add($waypoint);
            $waypoint->setTrip($this);
        }

        return $this;
    }

    public function removeWaypoint(Waypoint $waypoint): static
    {
        if ($this->waypoints->removeElement($waypoint)) {
            // set the owning side to null (unless already changed)
            if ($waypoint->getTrip() === $this) {
                $waypoint->setTrip(null);
            }
        }

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
}