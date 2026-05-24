<?php

namespace App\Providers;

use App\Models\Order;
use App\Models\Review;
use App\Policies\OrderPolicy;
use App\Policies\ReviewPolicy;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // Register Policies
        Gate::policy(Order::class, OrderPolicy::class);
        Gate::policy(Review::class, ReviewPolicy::class);

        // Configure password reset URL
        ResetPassword::createUrlUsing(function (object $notifiable, string $token) {
            return config('app.frontend_url')."/password-reset/$token?email={$notifiable->getEmailForPasswordReset()}";
        });

        // Prevent lazy loading in development
        // Model::preventLazyLoading(!app()->isProduction());

        // JSON response for all API endpoints
        \Illuminate\Support\Facades\Response::macro('apiSuccess', function ($data = null, string $message = 'Success', int $status = 200) {
            return response()->json([
                'success' => true,
                'message' => $message,
                'data' => $data,
            ], $status);
        });

        \Illuminate\Support\Facades\Response::macro('apiError', function (string $message = 'Error', int $status = 400, array $errors = []) {
            $response = [
                'success' => false,
                'message' => $message,
            ];
            if (!empty($errors)) {
                $response['errors'] = $errors;
            }
            return response()->json($response, $status);
        });
    }
}
