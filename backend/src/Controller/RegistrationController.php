<?php

namespace App\Controller;

use App\Entity\User;
use App\Enum\Gender;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class RegistrationController
{
    /**
     * Inscription d'un nouvel utilisateur.
     *
     * Création du compte avec :
     * - vérification email unique
     * - validation des données
     * - hash du mot de passe
     * - persistance Doctrine
     */
    #[Route('/register', name: 'register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $entityManager,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator,
        UserRepository $userRepository
    ): JsonResponse {

        $data = json_decode($request->getContent(), true);

        if (!is_array($data)) {
            return new JsonResponse([
                'error' => 'Invalid JSON'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (
            !isset(
            $data['email'],
            $data['password'],
            $data['first_name'],
            $data['last_name'],
            $data['phone'],
            $data['gender']
        )
        ) {
            return new JsonResponse([
                'error' => 'Missing required fields'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (
            $userRepository->findOneBy(['email' => $data['email']]) ||
            $userRepository->findOneBy(['phone' => $data['phone']])
        ) {
            return new JsonResponse([
                'error' => 'Invalid registration information'
            ], Response::HTTP_BAD_REQUEST);
        }

        if (strlen($data['password']) < 8) {
            return new JsonResponse([
                'error' => 'password must be longer than 8 character'
            ], Response::HTTP_BAD_REQUEST);
        }


        try {
            $gender = Gender::from($data['gender']);

        } catch (\ValueError) {

            return new JsonResponse([
                'error' => 'Invalid gender'
            ], Response::HTTP_BAD_REQUEST);
        }


        $user = new User();

        $user
            ->setEmail($data['email'])
            ->setFirstName($data['first_name'])
            ->setLastName($data['last_name'])
            ->setPhone($data['phone'])
            ->setGender($gender)
            ->setRoles(['ROLE_USER']);


        $user->setPassword(
            $passwordHasher->hashPassword(
                $user,
                $data['password']
            )
        );


        $errors = $validator->validate($user);

        if (count($errors) > 0) {

            $messages = [];

            foreach ($errors as $error) {
                $messages[] = $error->getMessage();
            }

            return new JsonResponse([
                'errors' => $messages
            ], Response::HTTP_BAD_REQUEST);
        }


        $entityManager->persist($user);
        $entityManager->flush();


        return new JsonResponse([
            'message' => 'User created',
            'id' => $user->getId()
        ], Response::HTTP_CREATED);
    }
}