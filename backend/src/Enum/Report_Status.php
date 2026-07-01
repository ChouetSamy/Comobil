<?php
namespace App\Enum;

enum Report_Status: string
{
    case PENDING= 'PENDING';
    case VALITADED= 'VALITADED';
    case REJECTED= 'REJECTED';
}