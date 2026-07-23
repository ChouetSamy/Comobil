<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserInfo;
use App\Repository\UserInfoRepository;
use App\Enum\Gender;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class ProfileController extends AbstractController
{
    #[Route('/profile', name: 'profile_show', methods: ['GET'])]
     #[IsGranted('ROLE_USER')]
    public function show(): JsonResponse
    {
        /** @var User|null $user */
        $user = $this->getUser();
        

        if (!$user ||$user->getDeletedAt() !== null) {
            return new JsonResponse([
                'error' => 'Unauthorized'
            ], 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'first_name' => $user->getFirstName(),
            'last_name' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'gender' => $user->getGender()?->value,
            'roles' => $user->getRoles(),
            'created_at' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
        ]);
    }


    #[Route('/profile', name: 'profile_update', methods: ['PATCH'])]
    #[IsGranted('ROLE_USER')]
    public function update(
        Request $request,
        EntityManagerInterface $entityManager,
        ValidatorInterface $validator
    ): JsonResponse {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user ||$user->getDeletedAt() !== null) {
            return new JsonResponse([
                'error' => 'Unauthorized'
            ], 401);
        }

        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return new JsonResponse([
                'error' => 'Invalid JSON'
            ], 400);
        }

        if (isset($data['first_name'])) {
            $user->setFirstName($data['first_name']);
        }

        if (isset($data['last_name'])) {
            $user->setLastName($data['last_name']);
        }

        if (isset($data['phone'])) {
            $user->setPhone($data['phone']);
        }

        if (isset($data['gender'])) {
            try {
                $user->setGender(
                    Gender::from($data['gender'])
                );
            } catch (\ValueError) {
                return new JsonResponse([
                    'error' => 'Invalid gender'
                ], 400);
            }
        }

        $user->setUpdatedAt(new \DateTime());

        $errors = $validator->validate($user);

        if (count($errors) > 0) {
            return new JsonResponse([
                'errors' => (string) $errors
            ], 400);
        }

        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Profile updated'
        ]);
    }


    #[Route('/profile', name: 'profile_delete', methods: ['DELETE'])]
     #[IsGranted('ROLE_USER')]
    public function delete(
        EntityManagerInterface $entityManager
    ): JsonResponse {
        /** @var User|null $user */
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse([
                'error' => 'Unauthorized'
            ], 401);
        }
        $user->incrementTokenVersion();
        $user->setDeletedAt(new \DateTime());

        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Profile deleted'
        ]);
    }



    #[Route('/profile', name: 'profile_info_update', methods: ['POST'])]
    #[IsGranted('ROLE_USER')]
    public function upsert(
        Request $request,
        UserInfoRepository $userInfoRepository,
        EntityManagerInterface $entityManager
    ): JsonResponse {
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);

        $userInfo = $userInfoRepository->findOneBy([
            'user' => $user,
        ]);

        if (!$userInfo) {
            $userInfo = new UserInfo();
            $userInfo->setUser($user);
        }

        if (array_key_exists('picture_url', $data)) {
            $userInfo->setPictureUrl($data['picture_url']);
        }

        if (array_key_exists('bio', $data)) {
            $userInfo->setBio($data['bio']);
        }

        if (array_key_exists('accept_call', $data)) {
            $userInfo->setAcceptCall($data['accept_call']);
        }

        $userInfo->setUpdatedAt(new \DateTime());

        $entityManager->persist($userInfo);
        $entityManager->flush();

        return $this->json([
            'message' => 'UserInfo updated successfully',
            'user_info' => [
                'id' => $userInfo->getId(),
                'picture_url' => $userInfo->getPictureUrl(),
                'bio' => $userInfo->getBio(),
                'accept_call' => $userInfo->isAcceptCall(),
                'average_rating' => $userInfo->getAverageRating(),
            ],
        ]);
    }
}