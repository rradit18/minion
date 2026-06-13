<?php

namespace App\Http\Controllers\Api;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Models\CustomerPunchCard;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    use ApiResponse;

    public function register(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'phone'    => ['required', 'string', 'max:20', 'unique:users,phone'],
            'email'    => ['nullable', 'email', 'unique:users,email'],
            'password' => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = User::create([
            'name'      => $validated['name'],
            'phone'     => $validated['phone'],
            'email'     => $validated['email'] ?? null,
            'password'  => Hash::make($validated['password']),
            'role'      => UserRole::Customer,
            'is_active' => true,
        ]);

        CustomerPunchCard::create([
            'customer_user_id'     => $user->id,
            'punch_count'          => 0,
            'lifetime_punch_count' => 0,
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'status'  => true,
            'message' => 'Registrasi berhasil.',
            'data'    => ['id' => $user->id, 'token' => $token],
        ], 201);
    }

    public function login(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'phone'    => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $user = User::where('phone', $validated['phone'])->first();

        if (! $user || ! Hash::check($validated['password'], $user->password)) {
            return $this->error('Nomor HP atau password salah.', 401);
        }

        if (! $user->is_active) {
            return $this->error('Akun tidak aktif.', 403);
        }

        $user->tokens()->delete();
        $token = $user->createToken('api')->plainTextToken;

        return $this->ok('Login berhasil.', [
            'token'                 => $token,
            'force_password_change' => $user->force_password_change,
        ]);
    }

    public function changePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'string'],
            'password'         => ['required', 'confirmed', Password::min(8)],
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            return $this->error('Password saat ini salah.', 422);
        }

        $user->password = Hash::make($validated['password']);
        $user->force_password_change = false;
        $user->save();

        return $this->ok('Password berhasil diubah.');
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return $this->deleted('Logout berhasil.');
    }

    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $data = ['user' => $user];

        if ($user->role === UserRole::Customer) {
            $data['punch_card'] = $user->punchCard;
        }

        return $this->ok('OK', $data);
    }
}
