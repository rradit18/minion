<?php

namespace App\Enums;

enum ShiftStatus: string
{
    case Scheduled = 'scheduled';
    case OnDuty    = 'on_duty';
    case Completed = 'completed';
    case Cancelled = 'cancelled';
}
