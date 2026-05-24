<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SetLocale
{
    public function handle(Request $request, Closure $next): Response
    {
        $locale = 'en';

        // Check Accept-Language header
        $acceptLanguage = $request->header('Accept-Language', '');
        $preferredLocale = $request->header('X-Locale', '');

        if ($preferredLocale && in_array($preferredLocale, ['en', 'ar'])) {
            $locale = $preferredLocale;
        } elseif (str_starts_with($acceptLanguage, 'ar')) {
            $locale = 'ar';
        } elseif (str_starts_with($acceptLanguage, 'en')) {
            $locale = 'en';
        }

        // Check authenticated user preference
        if ($request->user() && in_array($request->user()->preferred_language, ['en', 'ar'])) {
            $locale = $request->user()->preferred_language;
        }

        app()->setLocale($locale);

        return $next($request);
    }
}
