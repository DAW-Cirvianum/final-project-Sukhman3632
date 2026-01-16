<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckAbility
{

    public function handle(Request $request, Closure $next, string $ability): Response
    {
        // Check if user is authenticated
        if (!$request->user()) {
            return response()->json(['message' => 'Unauthenticated'], 401);
        }

        // Check if current token has the required ability
        if (!$request->user()->tokenCan($ability)) {
            return response()->json([
                'message' => 'Unauthorized. Your token does not have the required permissions.'
            ], 403);
        }

        return $next($request);
    }
}
