<?php

namespace App\Tests;

use App\Entity\PasswordResetRequest;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Doctrine\ORM\Tools\SchemaTool;
use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class AuthApiTest extends WebTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        self::ensureKernelShutdown();
        static::createClient();
        /** @var EntityManagerInterface $entityManager */
        $entityManager = static::getContainer()->get(EntityManagerInterface::class);
        $metadata = $entityManager->getMetadataFactory()->getAllMetadata();
        $schemaTool = new SchemaTool($entityManager);
        $schemaTool->dropSchema($metadata);
        $schemaTool->createSchema($metadata);
        $entityManager->clear();
        self::ensureKernelShutdown();
    }

    public function testRegisterAndAccessPrivateEndpoint(): void
    {
        $client = static::createClient();

        $client->request('POST', '/auth/register', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'email' => 'alice@example.com',
            'password' => 'StrongPassword123!',
        ], JSON_THROW_ON_ERROR));

        self::assertResponseStatusCodeSame(201);
        $payload = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('token', $payload);
        self::assertArrayHasKey('refresh_token', $payload);

        $client->request('GET', '/api/me', server: [
            'HTTP_AUTHORIZATION' => sprintf('Bearer %s', $payload['token']),
        ]);
        self::assertResponseIsSuccessful();
    }

    public function testRefreshTokenRotationRejectsReusedToken(): void
    {
        $client = static::createClient();

        $client->request('POST', '/auth/register', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'email' => 'bob@example.com',
            'password' => 'AnotherStrongPassword123!',
        ], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);
        $registrationPayload = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        $refreshToken = $registrationPayload['refresh_token'];

        $client->request('POST', '/auth/token/refresh', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'refresh_token' => $refreshToken,
        ], JSON_THROW_ON_ERROR));
        self::assertResponseIsSuccessful();

        $refreshPayload = json_decode((string) $client->getResponse()->getContent(), true, 512, JSON_THROW_ON_ERROR);
        self::assertArrayHasKey('token', $refreshPayload);
        self::assertArrayHasKey('refresh_token', $refreshPayload);

        $client->request('POST', '/auth/token/refresh', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'refresh_token' => $refreshToken,
        ], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(401);
    }

    public function testPasswordResetAllowsLoginWithNewPassword(): void
    {
        $client = static::createClient();
        /** @var EntityManagerInterface $entityManager */
        $entityManager = static::getContainer()->get(EntityManagerInterface::class);

        $client->request('POST', '/auth/register', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'email' => 'carol@example.com',
            'password' => 'OriginalPassword123!',
        ], JSON_THROW_ON_ERROR));
        self::assertResponseStatusCodeSame(201);

        /** @var User $user */
        $user = $entityManager->getRepository(User::class)->findOneBy(['email' => 'carol@example.com']);
        self::assertInstanceOf(User::class, $user);

        $selector = 'selector-token';
        $verifier = 'known-verifier';

        $reset = (new PasswordResetRequest())
            ->setUser($user)
            ->setSelector($selector)
            ->setHashedVerifier(hash('sha256', $verifier))
            ->setExpiresAt(new \DateTimeImmutable('+1 hour'));
        $entityManager->persist($reset);
        $entityManager->flush();

        $client->request('POST', '/auth/password/reset', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'selector' => $selector,
            'token' => $verifier,
            'password' => 'UpdatedPassword123!',
        ], JSON_THROW_ON_ERROR));
        self::assertResponseIsSuccessful();

        $client->request('POST', '/auth/login', server: ['CONTENT_TYPE' => 'application/json'], content: json_encode([
            'email' => 'carol@example.com',
            'password' => 'UpdatedPassword123!',
        ], JSON_THROW_ON_ERROR));
        self::assertResponseIsSuccessful();
    }
}
