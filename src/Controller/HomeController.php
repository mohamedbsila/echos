<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;

class HomeController extends AbstractController
{
    #[Route('/', name: 'home')]
    public function index(Request $request): Response
    {
        // Detect mobile device
        $userAgent = $request->headers->get('User-Agent');
        $isMobile = $this->isMobileDevice($userAgent);
        
        // Use mobile template for mobile devices, desktop template for others
        $template = $isMobile ? 'home/mobile.html.twig' : 'home/index.html.twig';
        
        return $this->render($template);
    }
    
    /**
     * Detect if the user is on a mobile device
     */
    private function isMobileDevice(?string $userAgent): bool
    {
        if (!$userAgent) {
            return false;
        }
        
        // Mobile device patterns
        $mobilePatterns = [
            '/Android/i',
            '/iPhone/i',
            '/iPad/i',
            '/iPod/i',
            '/BlackBerry/i',
            '/Windows Phone/i',
            '/Mobile/i',
            '/Tablet/i'
        ];
        
        foreach ($mobilePatterns as $pattern) {
            if (preg_match($pattern, $userAgent)) {
                return true;
            }
        }
        
        return false;
    }
} 