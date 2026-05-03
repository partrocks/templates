<?php

namespace App\Service;

use App\Entity\User;
use Gesdinet\JWTRefreshTokenBundle\Generator\RefreshTokenGeneratorInterface;
use Gesdinet\JWTRefreshTokenBundle\Model\RefreshTokenManagerInterface;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\DependencyInjection\Attribute\Autowire;

class AuthTokenFactory
{
    public function __construct(
        private readonly JWTTokenManagerInterface $jwtTokenManager,
        private readonly RefreshTokenGeneratorInterface $refreshTokenGenerator,
        private readonly RefreshTokenManagerInterface $refreshTokenManager,
        #[Autowire('%env(int:JWT_ACCESS_TTL)%')]
        private readonly int $accessTtl,
        #[Autowire('%env(int:JWT_REFRESH_TTL)%')]
        private readonly int $refreshTtl,
    ) {
    }

    public function createTokenPair(User $user): array
    {
        $accessToken = $this->jwtTokenManager->create($user);
        $refreshToken = $this->refreshTokenGenerator->createForUserWithTtl(
            $user,
            $this->refreshTtl
        );

        $this->refreshTokenManager->save($refreshToken);

        return [
            'token' => $accessToken,
            'refresh_token' => $refreshToken->getRefreshToken(),
            'expires_in' => $this->accessTtl,
        ];
    }
}
