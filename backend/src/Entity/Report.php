<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use App\Enum\Report_Status;
use App\Repository\ReportRepository;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource(operations: [
    new Get(security: "is_granted('ROLE_USER')"),
    new GetCollection(security: "is_granted('ROLE_USER')"),
    new Post(security: "is_granted('ROLE_USER')"),
    new Patch(security: "is_granted('ROLE_USER')"),
    new Delete(security: "is_granted('ROLE_USER')")
])]
#[ORM\HasLifecycleCallbacks]

#[ORM\Entity(repositoryClass: ReportRepository::class)]
class Report
{    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $reporter = null;

    #[ORM\ManyToOne(inversedBy: 'reports')]
    private ?User $reported = null;

    #[ORM\Column(length: 255)]
    private ?string $reason = null;

    #[ORM\Column(length: 255)]
    private ?string $description = null;

    #[ORM\Column(enumType: Report_Status::class)]
    private ?Report_Status $reportStatus = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $moderatorNotes = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->reportStatus = Report_Status::PENDING;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReporter(): ?User
    {
        return $this->reporter;
    }

    public function setReporter(?User $reporter): static
    {
        $this->reporter = $reporter;

        return $this;
    }

    public function getReported(): ?User
    {
        return $this->reported;
    }

    public function setReported(?User $reported): static
    {
        $this->reported = $reported;

        return $this;
    }

    public function getReason(): ?string
    {
        return $this->reason;
    }

    public function setReason(string $reason): static
    {
        $this->reason = $reason;

        return $this;
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

    public function getReportStatus(): ?Report_Status
    {
        return $this->reportStatus;
    }

    public function setReportStatus(Report_Status $reportStatus): static
    {
        $this->reportStatus = $reportStatus;

        return $this;
    }

    public function getModeratorNotes(): ?string
    {
        return $this->moderatorNotes;
    }

    public function setModeratorNotes(?string $moderatorNotes): static
    {
        $this->moderatorNotes = $moderatorNotes;

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
}
