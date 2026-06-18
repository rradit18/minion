<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Storage;
use Throwable;

class HealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        $checks  = [];
        $healthy = true;

        // ─── Database ──────────────────────────────────────────────────────────
        try {
            DB::select('SELECT 1');
            $checks['database'] = ['status' => 'ok'];
        } catch (Throwable $e) {
            $checks['database'] = ['status' => 'fail', 'error' => $e->getMessage()];
            $healthy = false;
        }

        // ─── Redis ─────────────────────────────────────────────────────────────
        try {
            Redis::ping();
            $checks['redis'] = ['status' => 'ok'];
        } catch (Throwable $e) {
            $checks['redis'] = ['status' => 'fail', 'error' => $e->getMessage()];
            $healthy = false;
        }

        // ─── Storage ───────────────────────────────────────────────────────────
        try {
            Storage::disk('public')->put('.health', now()->toIso8601String());
            Storage::disk('public')->delete('.health');
            $checks['storage'] = ['status' => 'ok'];
        } catch (Throwable $e) {
            $checks['storage'] = ['status' => 'fail', 'error' => $e->getMessage()];
            $healthy = false;
        }

        // ─── Cache ─────────────────────────────────────────────────────────────
        try {
            Cache::put('health_check', true, 5);
            Cache::forget('health_check');
            $checks['cache'] = ['status' => 'ok'];
        } catch (Throwable $e) {
            $checks['cache'] = ['status' => 'fail', 'error' => $e->getMessage()];
            $healthy = false;
        }

        return response()->json([
            'status'  => $healthy ? 'healthy' : 'unhealthy',
            'checks'  => $checks,
            'version' => config('app.version', '1.0.0'),
            'env'     => config('app.env'),
            'time'    => now()->toIso8601String(),
        ], $healthy ? 200 : 503);
    }
}
