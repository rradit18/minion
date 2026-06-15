<?php

namespace App\Traits;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;

trait ApiResponse
{
    protected function ok(string $message, mixed $data = null): JsonResponse
    {
        $body = ['status' => true, 'message' => $message];
        if ($data !== null) {
            $body['data'] = $data;
        }
        return response()->json($body, 200);
    }

    protected function created(string $message, string $id): JsonResponse
    {
        return response()->json([
            'status'  => true,
            'message' => $message,
            'data'    => ['id' => $id],
        ], 201);
    }

    protected function updated(string $message, string $id): JsonResponse
    {
        return response()->json([
            'status'  => true,
            'message' => $message,
            'data'    => ['id' => $id],
        ], 200);
    }

    protected function deleted(string $message): JsonResponse
    {
        return response()->json([
            'status'  => true,
            'message' => $message,
        ], 200);
    }

    protected function paginated(string $message, LengthAwarePaginator $paginator): JsonResponse
    {
        return response()->json([
            'status'  => true,
            'message' => $message,
            'data'    => $paginator->items(),
            'meta'    => [
                'current_page' => $paginator->currentPage(),
                'per_page'     => $paginator->perPage(),
                'total'        => $paginator->total(),
                'last_page'    => $paginator->lastPage(),
            ],
        ], 200);
    }

    protected function error(string $message, int $status = 400, array $errors = []): JsonResponse
    {
        $body = ['status' => false, 'message' => $message];
        if (!empty($errors)) {
            $body['errors'] = $errors;
        }
        return response()->json($body, $status);
    }
}
