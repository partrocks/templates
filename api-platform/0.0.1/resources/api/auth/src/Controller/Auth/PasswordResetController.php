<?php

namespace App\Controller\Auth;

use App\Entity\PasswordResetRequest;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Bridge\Twig\Mime\TemplatedEmail;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\RateLimiter\RateLimiterFactory;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/auth/password/reset')]
class PasswordResetController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
        private readonly UserPasswordHasherInterface $passwordHasher,
        private readonly MailerInterface $mailer,
        #[Autowire(service: 'limiter.auth_reset_request_ip')]
        private readonly RateLimiterFactory $authResetRequestIpLimiter,
        #[Autowire('%env(string:MAILER_FROM)%')]
        private readonly string $mailerFrom,
        #[Autowire('%env(string:APP_FRONTEND_RESET_URL)%')]
        private readonly string $frontendResetUrl,
    ) {
    }

    #[Route('/request', name: 'auth_password_reset_request', methods: ['POST'])]
    public function requestReset(Request $request): JsonResponse
    {
        if (!$this->consumeLimiter($request)) {
            return $this->json(['message' => 'Too many requests. Please try again shortly.'], Response::HTTP_TOO_MANY_REQUESTS);
        }

        $payload = $this->decodeJsonRequest($request);
        if (null === $payload) {
            return $this->json(['message' => 'If the account exists, a reset email has been sent.'], Response::HTTP_ACCEPTED);
        }

        $violations = $this->validator->validate($payload, new Assert\Collection(
            fields: [
                'email' => [new Assert\NotBlank(), new Assert\Email()],
            ],
            allowExtraFields: false,
        ));

        if (0 !== $violations->count()) {
            return $this->json(['message' => 'If the account exists, a reset email has been sent.'], Response::HTTP_ACCEPTED);
        }

        $email = mb_strtolower((string) $payload['email']);
        $user = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
        if (!$user instanceof User) {
            return $this->json(['message' => 'If the account exists, a reset email has been sent.'], Response::HTTP_ACCEPTED);
        }

        $selector = bin2hex(random_bytes(8));
        $verifier = bin2hex(random_bytes(32));

        $resetRequest = (new PasswordResetRequest())
            ->setUser($user)
            ->setSelector($selector)
            ->setHashedVerifier(hash('sha256', $verifier))
            ->setExpiresAt(new \DateTimeImmutable('+1 hour'));

        $this->entityManager->persist($resetRequest);
        $this->entityManager->flush();

        $resetLink = sprintf('%s?selector=%s&token=%s', $this->frontendResetUrl, $selector, $verifier);

        $message = (new TemplatedEmail())
            ->to($user->getEmail())
            ->from(new Address($this->mailerFrom))
            ->subject('Reset your password')
            ->htmlTemplate('emails/password_reset.html.twig')
            ->context([
                'resetLink' => $resetLink,
            ]);

        $this->mailer->send($message);

        return $this->json(['message' => 'If the account exists, a reset email has been sent.'], Response::HTTP_ACCEPTED);
    }

    #[Route('', name: 'auth_password_reset', methods: ['POST'])]
    public function resetPassword(Request $request): JsonResponse
    {
        $payload = $this->decodeJsonRequest($request);
        if (null === $payload) {
            return $this->json(['message' => 'Invalid or expired reset token.'], Response::HTTP_BAD_REQUEST);
        }

        $violations = $this->validator->validate($payload, new Assert\Collection(
            fields: [
                'selector' => [new Assert\NotBlank()],
                'token' => [new Assert\NotBlank()],
                'password' => [new Assert\NotBlank(), new Assert\Length(min: 12, max: 4096)],
            ],
            allowExtraFields: false,
        ));

        if (0 !== $violations->count()) {
            return $this->json(['message' => 'Invalid or expired reset token.'], Response::HTTP_BAD_REQUEST);
        }

        $resetRequest = $this->entityManager->getRepository(PasswordResetRequest::class)->findOneBy([
            'selector' => (string) $payload['selector'],
            'usedAt' => null,
        ]);

        if (!$resetRequest instanceof PasswordResetRequest || $resetRequest->isExpired()) {
            return $this->json(['message' => 'Invalid or expired reset token.'], Response::HTTP_BAD_REQUEST);
        }

        $providedTokenHash = hash('sha256', (string) $payload['token']);
        if (!hash_equals($resetRequest->getHashedVerifier(), $providedTokenHash)) {
            return $this->json(['message' => 'Invalid or expired reset token.'], Response::HTTP_BAD_REQUEST);
        }

        $user = $resetRequest->getUser();
        if (!$user instanceof User) {
            return $this->json(['message' => 'Invalid or expired reset token.'], Response::HTTP_BAD_REQUEST);
        }

        $user->setPassword($this->passwordHasher->hashPassword($user, (string) $payload['password']));
        $user->resetFailedLoginAttempts();
        $resetRequest->setUsedAt(new \DateTimeImmutable());

        $this->entityManager->createQuery('DELETE FROM App\Entity\RefreshToken rt WHERE rt.username = :username')
            ->setParameter('username', $user->getUserIdentifier())
            ->execute();

        $this->entityManager->flush();

        return $this->json(['message' => 'Password has been reset.'], Response::HTTP_OK);
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

    private function consumeLimiter(Request $request): bool
    {
        $ip = $request->getClientIp() ?? 'unknown';

        return $this->authResetRequestIpLimiter->create($ip)->consume()->isAccepted();
    }
}
