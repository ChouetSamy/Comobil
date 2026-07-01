<?php
namespace App\Enum;

enum Trip_Status: string
{
    case PUBLISHED= 'PUBLISHED';
    case FULL= 'FULL';
    case CANCELLED= 'CANCELLED';
    case FINISHED= 'FINISHED';
}