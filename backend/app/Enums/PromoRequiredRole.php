<?php

namespace App\Enums;

enum PromoRequiredRole: string
{
    case All              = 'all';
    case RegisteredOnly   = 'registered_only';
}
