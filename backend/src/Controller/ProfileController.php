<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\UserInfo;
use App\Repository\UserInfoRepository;
use App\Repository\UserRepository;
use App\Enum\Gender;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
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
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phone' => $user->getPhone(),
            'gender' => $user->getGender()?->value,
            'roles' => $user->getRoles(),
            'createdAt' => $user->getCreatedAt()?->format('Y-m-d H:i:s'),
        ]);
    }


 #[Route('/profile', name: 'profile_update', methods: ['PATCH'])]
#[IsGranted('ROLE_USER')]
public function update(
    Request $request,
    EntityManagerInterface $entityManager,
    ValidatorInterface $validator,
    UserRepository $userRepository,
    UserPasswordHasherInterface $passwordHasher,
): JsonResponse {
    /** @var User|null $user */
    $user = $this->getUser();

    if (!$user || $user->getDeletedAt() !== null) {
        return new JsonResponse([
            'error' => 'Unauthorized',
        ], 401);
    }

    $data = json_decode($request->getContent(), true);

    if (!is_array($data)) {
        return new JsonResponse([
            'error' => 'Invalid JSON',
        ], 400);
    }

    if (isset($data['firstName'])) {
        $user->setFirstName($data['firstName']);
    }

    if (isset($data['lastName'])) {
        $user->setLastName($data['lastName']);
    }

    if (isset($data['phone'])) {
        $existingUser = $userRepository->findOneBy([
            'phone' => $data['phone'],
        ]);

        if (
            $existingUser !== null
            && $existingUser !== $user
        ) {
            return new JsonResponse([
                'error' => 'Phone already used.',
            ], 400);
        }

        $user->setPhone($data['phone']);
    }

    if (isset($data['email'])) {
        $existingUser = $userRepository->findOneBy([
            'email' => $data['email'],
        ]);

        if (
            $existingUser !== null
            && $existingUser !== $user
        ) {
            return new JsonResponse([
                'error' => 'Email already used.',
            ], 400);
        }

        $user->setEmail($data['email']);
    }

    if (isset($data['gender'])) {
        try {
            $user->setGender(
                Gender::from($data['gender'])
            );
        } catch (\ValueError) {
            return new JsonResponse([
                'error' => 'Invalid gender',
            ], 400);
        }
    }

    if (
        isset($data['password'])
        && $data['password'] !== ''
    ) {
        if (strlen($data['password']) < 8) {
            return new JsonResponse([
                'error' => 'Password must contain at least 8 characters.',
            ], 400);
        }

        $user->setPassword(
            $passwordHasher->hashPassword(
                $user,
                $data['password']
            )
        );
    }

    $user->setUpdatedAt(new \DateTime());

    $errors = $validator->validate($user);

    if (count($errors) > 0) {
        $messages = [];

        foreach ($errors as $error) {
            $messages[] = $error->getMessage();
        }

        return new JsonResponse([
            'errors' => $messages,
        ], 400);
    }

    $entityManager->flush();

    return new JsonResponse([
        'message' => 'Profile updated',
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
            'userInfo' => [
                'id' => $userInfo->getId(),
                'pictureUrl' => $userInfo->getPictureUrl(),
                'bio' => $userInfo->getBio(),
                'acceptCall' => $userInfo->isAcceptCall(),
                'averageRating' => $userInfo->getAverageRating(),
            ],
        ]);
    }
}