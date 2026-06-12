<?php

namespace App\Enums;

enum BookingStatus: string
{
    case PendingConfirmation = 'pending_confirmation';
    case Confirmed           = 'confirmed';
    case InProgress          = 'in_progress';
    case Completed           = 'completed';
    case Expired             = 'expired';
    case Cancelled           = 'cancelled';
}
