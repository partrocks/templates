<?php

namespace App\Controller\Auth;

use App\Entity\User;
use App\Service\AuthTokenFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/auth')]
class AuthController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly ValidatorInterface $validator,
        private readonly AuthTokenFactory $authTokenFactory,
        #[Autowire(service: 'limiter.auth_login_ip')]
        private readonly RateLimiterFactory $authLoginIpLimiter,
        #[Autowire(service: 'limiter.auth_register_ip')]
        private readonly RateLimiterFactory $authRegisterIpLimiter,
        #[Autowire('%env(int:AUTH_LOGIN_LOCK_THRESHOLD)%')]
        private readonly int $lockThreshold,
        #[Autowire('%env(int:AUTH_LOGIN_LOCK_MINUTES)%')]
        private readonly int $lockMinutes,
    ) {
    }

    #[Route('/register', name: 'auth_register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        if (!$this->consumeLimiter($this->authRegisterIpLimiter, $request)) {
            return $this->json(['message' => 'Too many requests. Please try again shortly.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $payload = $this->decodeJsonRequest($request);
        if (null === $payload) {
            return $this->json(['message' => 'Invalid JSON payload.'], Response::HTTP_BAD_REQUEST);
        }

        $violations = $this->validator->validate($payload, new Assert\Collection(
            fields: [
                'email' => [new Assert\NotBlank(), new Assert\Email()],
                'password' => [new Assert\NotBlank(), new Assert\Length(min: 12, max: 4096)],
            ],
            allowExtraFields: false,
        ));

        if (0 !== $violations->count()) {
            return $this->json(['message' => 'Validation failed.'], Response::HTTP_BAD_REQUEST);
        }

        $email = mb_strtolower((string) $payload['email']);
        $existing = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if ($existing instanceof User) {
            return $this->json(['message' => 'There is already an account with this email.'], Response::HTTP_CONFLICT);
        }

        $user = (new User())
            ->setEmail($email)
            ->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, (string) $payload['password']));

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $this->json($this->authTokenFactory->createTokenPair($user), Response::HTTP_CREATED);
    }

    #[Route('/login', name: 'auth_login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        if (!$this->consumeLimiter($this->authLoginIpLimiter, $request)) {
            return $this->json(['message' => 'Too many requests. Please try again shortly.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $payload = $this->decodeJsonRequest($request);
        if (null === $payload) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        $violations = $this->validator->validate($payload, new Assert\Collection(
            fields: [
                'email' => [new Assert\NotBlank(), new Assert\Email()],
                'password' => [new Assert\NotBlank()],
            ],
            allowExtraFields: false,
        ));

        if (0 !== $violations->count()) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        $email = mb_strtolower((string) $payload['email']);
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user instanceof User) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        if ($user->isLocked()) {
            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        if (!$this->passwordHasher->isPasswordValid($user, (string) $payload['password'])) {
            $this->recordFailedLogin($user);

            return $this->json(['message' => 'Invalid credentials.'], Response::HTTP_UNAUTHORIZED);
        }

        $user->resetFailedLoginAttempts();
        $this->entityManager->flush();

        return $this->json($this->authTokenFactory->createTokenPair($user), Response::HTTP_OK);
    }

    private function decodeJsonRequest(Request $request): ?array
    {
        try {
            $payload = json_decode((string) $request->getContent(), true, 512, JSON_THROW_ON_ERROR);
        } catch (\JsonException) {
            return null;
        }

        return is_array($payload) ? $payload : null;
    }

    private function consumeLimiter(RateLimiterFactory $factory, Request $request): bool
    {
        $ip = $request->getClientIp() ?? 'unknown';
        $limit = $factory->create($ip)->consume();

        return $limit->isAccepted();
    }

    private function recordFailedLogin(User $user): void
    {
        $user->incrementFailedLoginAttempts();

        if ($user->getFailedLoginAttempts() >= $this->lockThreshold) {
            $user->setLockedUntil(new \DateTimeImmutable(sprintf('+%d minutes', $this->lockMinutes)));
            $user->setFailedLoginAttempts(0);
        }

        $this->entityManager->flush();
    }
}
