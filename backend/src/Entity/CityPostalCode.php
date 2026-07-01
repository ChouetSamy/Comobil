<?php

namespace App\Entity;

use App\Repository\CityPostalCodeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CityPostalCodeRepository::class)]
class CityPostalCode
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Relation ManyToOne vers City
    #[ORM\ManyToOne(targetEntity: City::class, inversedBy: 'postalCodes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?City $city = null;

    // Relation ManyToOne vers PostalCode
    #[ORM\ManyToOne(targetEntity: PostalCode::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?PostalCode $postalCode = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCity(): ?City
    {
        return $this->city;
    }

    public function setCity(?City $city): static
    {
        $this->city = $city;
        return $this;
    }

    public function getPostalCode(): ?PostalCode
    {
        return $this->postalCode;
    }

    public function setPostalCode(?PostalCode $postalCode): static
    {
        $this->postalCode = $postalCode;
        return $this;
    }
}