<?php

namespace App\Policies;

use App\Models\Review;
use App\Models\User;

class ReviewPolicy
{
    public function viewAny(?User $user): bool
    {
        return true;
    }

    public function view(?User $user, Review $review): bool
    {
        if ($review->is_approved) {
            return true;
        }

        if (!$user) {
            return false;
        }

        return $user->isAdmin() || $user->id === $review->user_id;
    }

    public function create(User $user): bool
    {
        return true;
    }

    public function update(User $user, Review $review): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $review->user_id && !$review->is_approved;
    }

    public function delete(User $user, Review $review): bool
    {
        if ($user->isAdmin()) {
            return true;
        }

        return $user->id === $review->user_id;
    }

    public function approve(User $user): bool
    {
        return $user->isAdmin();
    }
}
