<?php

declare(strict_types=1);

namespace App\Controller;

use Doctrine\Persistence\ManagerRegistry;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class LandingController extends AbstractController
{
    #[Route('/', name: 'app_landing', methods: ['GET'])]
    public function __invoke(ManagerRegistry $doctrine): Response
    {
        $dbConnected = false;
        $dbErrorMessage = null;

        try {
            $doctrine->getConnection()->executeQuery('SELECT 1');
            $dbConnected = true;
        } catch (\Throwable $e) {
            $dbErrorMessage = $e->getMessage();
        }

        return $this->render('landing.html.twig', [
            'dbConnected' => $dbConnected,
            'dbErrorMessage' => $dbErrorMessage,
            'quotesCollectionPath' => '/api/quotes',
        ]);
    }
}
