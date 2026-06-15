<?php

namespace App\Providers;

use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Gate::define('is-customer', fn($user) => $user->role->value === 'customer');
        Gate::define('is-barber',   fn($user) => $user->role->value === 'barber');
        Gate::define('is-kasir',    fn($user) => $user->role->value === 'cashier');
        Gate::define('is-admin',    fn($user) => $user->role->value === 'admin');
    }
}
