<?php

namespace App\Enums;

enum FeedbackCategory: string
{
    case Pelayanan  = 'pelayanan';
    case Kebersihan = 'kebersihan';
    case Barber     = 'barber';
    case Harga      = 'harga';
    case Fasilitas  = 'fasilitas';
    case Lainnya    = 'lainnya';
}
