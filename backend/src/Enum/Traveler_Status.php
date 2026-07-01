<?php
namespace App\Enum;

enum Traveler_Status: string
{
    case PENDING= 'PENDING';
    case EXCLUDED= 'EXCLUDED';
    case ARRIVED= 'ARRIVED';
}