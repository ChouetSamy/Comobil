<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\Trip_Creator_Role;
use App\Enum\Trip_Status;
use App\State\Processor\TripDeleteProcessor;
use App\State\Provider\UserTripHistoryProvider;
use App\State\Provider\TripSearchProvider;
use App\Repository\TripRepository;
use App\State\Processor\TripUpdateProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            uriTemplate: '/trips/search',
            provider: TripSearchProvider::class,
            security: "is_granted('ROLE_USER')",
        ),

        new Get(security: "is_granted('TRIP_VIEW', object)"),

        new GetCollection(
            uriTemplate: '/my-trips/upcoming',
            provider: UserTripHistoryProvider::class,
            security: "is_granted('ROLE_USER')",
        ),

        new GetCollection(
            uriTemplate: '/my-trips/past',
            provider: UserTripHistoryProvider::class,
            security: "is_granted('ROLE_USER')",
        ),


        new Post(security: "is_granted('ROLE_USER')"),
        new Patch(
            security: "is_granted('TRIP_EDIT', object)",
            processor: TripUpdateProcessor::class
        ),
        new Delete(
            security: "is_granted('TRIP_DELETE', object)",
            processor: TripDeleteProcessor::class
        )
    ]
)]


#[ORM\HasLifecycleCallbacks]

#[ORM\Entity(repositoryClass: TripRepository::class)]
class Trip
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    #[Assert\NotNull(message: 'La date de départ est obligatoire.')]
    private ?\DateTime $departureDatetime = null;

    #[ORM\Column]
    #[Assert\NotNull(message: 'La date d’arrivée estimée est obligatoire.')]
    private ?\DateTime $estimatedArrivalDatetime = null;

    #[ORM\Column]
    #[Assert\NotNull(message: 'Le prix total est obligatoire.')]
    #[Assert\PositiveOrZero(message: 'Le prix doit être positif ou nul.')]
    private ?float $totalPrice = 0;

    #[ORM\Column]
    #[Assert\NotNull(message: 'Le nombre de places est obligatoire.')]
    #[Assert\Positive(message: 'Le nombre de places doit être supérieur à 0.')]
    private ?int $availableSeats = 3;

    #[ORM\Column(enumType: Trip_Creator_Role::class)]
    #[Assert\NotNull(message: 'Le rôle du créateur est obligatoire.')]
    private ?Trip_Creator_Role $tripCreatorRole = Trip_Creator_Role::DRIVER;

    /**
     * @var Collection<int, Notification>
     */
    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'trip')]
    private Collection $notifications;

    #[ORM\ManyToOne(inversedBy: 'trips')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $creator = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: true)]
    private ?Vehicle $vehicle = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Adress $departureAddress = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?Adress $arrivalAddress = null;


    #[ORM\Column]
    #[ORM\JoinColumn(nullable: true)]
    private ?float $pricePerPassenger = null;

    #[ORM\Column]
    private ?float $averageRating = null;


    #[ORM\Column(enumType: Trip_Status::class)]
    private ?Trip_Status $tripStatus = null;

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

    /**
     * @var Collection<int, Review>
     */
    #[ORM\OneToMany(targetEntity: Review::class, mappedBy: 'trip')]
    private Collection $reviews;

    /**
     * @var Collection<int, Message>
     */
    #[ORM\OneToMany(targetEntity: Message::class, mappedBy: 'trip')]
    private Collection $messages;

    /**
     * @var Collection<int, Waypoint>
     */
    #[ORM\OneToMany(targetEntity: Waypoint::class, mappedBy: 'trip', orphanRemoval: true)]
    private Collection $waypoints;


    #[ORM\Column(nullable: false, options: ['default' => 'CURRENT_TIMESTAMP'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $updatedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTime $deletedAt = null;

    public function __construct()
    {
        $this->tripPreferences = new ArrayCollection();
        $this->travelers = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->messages = new ArrayCollection();
        $this->waypoints = new ArrayCollection();
        $this->notifications = new ArrayCollection();
        $this->availableSeats = 3;
        $this->averageRating = 0;
        $this->tripStatus = Trip_Status::PUBLISHED;
        $this->tripCreatorRole = Trip_Creator_Role::DRIVER;
        $this->createdAt = new \DateTimeImmutable();
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

    public function getAvailableSeats(): ?int
    {
        return $this->availableSeats;
    }

    public function setAvailableSeats(?int $availableSeats): static
    {
        $this->availableSeats = $availableSeats;

        return $this;
    }

    /**
     * @return Collection<int, Notification>
     */
    public function getNotifications(): Collection
    {
        return $this->notifications;
    }

    public function addNotification(Notification $notification): static
    {
        if (!$this->notifications->contains($notification)) {
            $this->notifications->add($notification);
            $notification->setTrip($this);
        }

        return $this;
    }

    public function removeNotification(Notification $notification): static
    {
        if ($this->notifications->removeElement($notification)) {
            if ($notification->getTrip() === $this) {
                $notification->setTrip(null);
            }
        }

        return $this;
    }
    public function getAverageRating(): ?float
    {
        return $this->averageRating;
    }

    public function setAverageRating(float $averageRating): static
    {
        $this->averageRating = $averageRating;

        return $this;
    }

    public function getDepartureDatetime(): ?\DateTime
    {
        return $this->departureDatetime;
    }

    public function setDepartureDatetime(\DateTime $departureDatetime): static
    {
        $this->departureDatetime = $departureDatetime;

        return $this;
    }

    public function getTotalPrice(): ?float
    {
        return $this->totalPrice;
    }

    public function setTotalPrice(float $totalPrice): static
    {
        $this->totalPrice = $totalPrice;

        return $this;
    }

    public function getPricePerPassenger(): ?float
    {
        return $this->pricePerPassenger;
    }

    public function setPricePerPassenger(float $pricePerPassenger): static
    {
        $this->pricePerPassenger = $pricePerPassenger;

        return $this;
    }

    public function getEstimatedArrivalDatetime(): ?\DateTime
    {
        return $this->estimatedArrivalDatetime;
    }

    public function setEstimatedArrivalDatetime(\DateTime $estimatedArrivalDatetime): static
    {
        $this->estimatedArrivalDatetime = $estimatedArrivalDatetime;

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
        return $this->tripCreatorRole;
    }

    public function setTripCreatorRole(Trip_Creator_Role $tripCreatorRole): static
    {
        $this->tripCreatorRole = $tripCreatorRole;

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

    /**
     * @return Collection<int, Message>
     */
    public function getMessages(): Collection
    {
        return $this->messages;
    }

    public function addMessage(Message $message): static
    {
        if (!$this->messages->contains($message)) {
            $this->messages->add($message);
            $message->setTrip($this);
        }

        return $this;
    }

    public function removeMessage(Message $message): static
    {
        if ($this->messages->removeElement($message)) {
            if ($message->getTrip() === $this) {
                $message->setTrip(null);
            }
        }

        return $this;
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

    public function getTripStatus(): ?Trip_Status
    {
        return $this->tripStatus;
    }

    public function setTripStatus(Trip_Status $tripStatus): static
    {
        $this->tripStatus = $tripStatus;

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
}