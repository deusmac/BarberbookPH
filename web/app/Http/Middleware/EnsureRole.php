<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class EnsureRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        $user = $request->user();
        if (! $user || $user->role !== $role) {
            abort($user ? 403 : 401, 'You do not have access to this page.');
        }

        return $next($request);
    }
}
