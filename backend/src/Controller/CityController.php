<?php

namespace App\Controller;

use App\Entity\City;
use App\Repository\CityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class CityController extends AbstractController
{
    #[Route(
        '/api/cities/find-or-create',
        name: 'city_find_or_create',
        methods: ['POST']
    )]
    #[IsGranted('ROLE_USER')]
    public function findOrCreate(
        Request $request,
        CityRepository $cityRepository,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        $data = json_decode(
            $request->getContent(),
            true
        );

        $commune = trim(
            $data['commune'] ?? ''
        );

        if ($commune === '') {
            return $this->json([
                'error' => 'Commune is required.',
            ], 400);
        }

        $city = $cityRepository
            ->createQueryBuilder('c')
            ->where('LOWER(c.commune) = LOWER(:commune)')
            ->setParameter('commune', $commune)
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();

        if ($city === null) {
            $city = new City();

            $city->setCommune($commune);

            $entityManager->persist($city);
            $entityManager->flush();
        }

        return $this->json([
            'id' => $city->getId(),
            '@id' => '/api/cities/' . $city->getId(),
            'commune' => $city->getCommune(),
        ]);
    }
}
