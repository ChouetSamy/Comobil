<?php
namespace App\Enum;

enum Vehicle_State: string
{
    case NEW= 'NEW';
    case VERY_GOOD= 'VERY_GOOD';
    case GOOD= 'GOOD';
    case BAD= 'BAD';
    case MAINTENANCE= 'MAINTENANCE';
}