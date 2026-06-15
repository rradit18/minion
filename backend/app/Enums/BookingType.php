<?php

namespace App\Enums;

enum BookingType: string
{
    case Online = 'online';
    case Walkin = 'walkin';
}
