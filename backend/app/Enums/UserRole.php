<?php

namespace App\Enums;

enum UserRole: string
{
    case Admin    = 'admin';
    case Cashier  = 'cashier';
    case Barber   = 'barber';
    case Customer = 'customer';
}
