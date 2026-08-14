<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserInfo;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

final class ProfilePictureController extends AbstractController
{
    #[Route('/profile/picture', name: 'profile_picture_upload', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function upload(
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

        /** @var UploadedFile|null $file */
        $file = $request->files->get('picture');

        if (!$file) {
            return $this->json([
                'error' => 'No file uploaded',
            ], 400);
        }

        if (!str_starts_with($file->getMimeType() ?? '', 'image/')) {
            return $this->json([
                'error' => 'Invalid image',
            ], 400);
        }

        if ($file->getSize() > 5 * 1024 * 1024) {
            return $this->json([
                'error' => 'Image is too large',
            ], 400);
        }

        $userInfo = $user->getUserInfo();

        if (!$userInfo) {
            $userInfo = new UserInfo();
            $userInfo->setUser($user);

            $entityManager->persist($userInfo);
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
            . '/public/uploads/profiles';

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
            '/uploads/profiles/'
            . $filename;

        $userInfo->setPictureUrl(
            $pictureUrl,
        );

        $userInfo->setUpdatedAt(
            new \DateTime(),
        );

        $entityManager->flush();

        return $this->json([
            'pictureUrl' => $pictureUrl,
        ]);
    }
}