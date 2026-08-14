<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Vehicle;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class VehiclePictureController extends AbstractController
{
    #[Route(
        '/api/vehicles/{id}/picture',
        name: 'vehicle_picture_upload',
        methods: ['POST']
    )]
    #[IsGranted('ROLE_USER')]
    public function upload(
        Vehicle $vehicle,
        Request $request,
        EntityManagerInterface $entityManager,
    ): JsonResponse {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user) {
            return $this->json([
                'error' => 'Unauthorized',
            ], 401);
        }

        /*
         * Le véhicule doit appartenir à la Fleet
         * associée au UserInfo connecté.
         */
        $userInfo = $user->getUserInfo();

        if (
            !$userInfo
            || !$userInfo->getFleet()
            || $vehicle->getFleet() !== $userInfo->getFleet()
        ) {
            return $this->json([
                'error' => 'You cannot modify this vehicle.',
            ], 403);
        }

        /** @var UploadedFile|null $file */
        $file = $request->files->get('picture');

        if (!$file) {
            return $this->json([
                'error' => 'No file uploaded',
            ], 400);
        }

        $mimeType = $file->getMimeType() ?? '';

        if (!str_starts_with($mimeType, 'image/')) {
            return $this->json([
                'error' => 'Invalid image',
            ], 400);
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            return $this->json([
                'error' => 'Image is too large',
            ], 400);
        }

        $extension =
            $file->guessExtension()
            ?? $file->getClientOriginalExtension()
            ?? 'jpg';

        $filename =
            bin2hex(random_bytes(16))
            . '.'
            . $extension;

        $directory =
            $this->getParameter('kernel.project_dir')
            . '/public/uploads/vehicles';

        if (!is_dir($directory)) {
            mkdir(
                $directory,
                0775,
                true,
            );
        }

        $file->move(
            $directory,
            $filename,
        );

        $pictureUrl =
            '/uploads/vehicles/'
            . $filename;

        $vehicle->setPictureUrl(
            $pictureUrl,
        );

        $vehicle->setUpdatedAt(
            new \DateTime,
        );

        $entityManager->flush();

        return $this->json([
            'pictureUrl' => $pictureUrl,
        ]);
    }
}