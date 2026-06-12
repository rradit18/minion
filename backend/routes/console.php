<?php

use App\Jobs\BookingExpiryJob;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new BookingExpiryJob)->everyMinute();
Schedule::command('cache:prune-stale-tags')->hourly();
