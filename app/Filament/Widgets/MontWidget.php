<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Data;
use App\Models\Sensor;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class MontWidget extends BaseWidget
{
    protected function getStats(): array
    {
        // Obtener el total por mes (suma de todos los sensores durante el mes actual)
        $monthlyTotals = Data::select(
            DB::raw('MONTH(start_time) as month'),
            DB::raw('YEAR(start_time) as year'),
            DB::raw('SUM(price) as total_price')
        )
            ->whereMonth('start_time', Carbon::now()->month) // Filtra por el mes actual
            ->whereYear('start_time', Carbon::now()->year) // Filtra por el año actual
            ->groupBy(DB::raw('MONTH(start_time)'), DB::raw('YEAR(start_time)'))
            ->get();

        // Crear las estadísticas mensuales
        $monthlyStats = [];

        foreach ($monthlyTotals as $item) {
            $monthlyStats[] = Stat::make("Total por Mes {$item->year}-{$item->month}", '$' . number_format($item->total_price, 2));
        }

        // Obtener el total por día (solo el día actual) para todos los sensores
        $dailyTotal = Data::select(
            DB::raw('DATE(start_time) as date'),
            DB::raw('SUM(price) as total_price')
        )
            ->whereDate('start_time', Carbon::today()) // Filtra solo los datos del día actual
            ->groupBy(DB::raw('DATE(start_time)')) // Agrupa solo por fecha
            ->first(); // Solo obtenemos el primer registro, ya que solo habrá uno para el día actual

        // Verificar si hay datos para el día actual
        $dailyStats = [];

        if ($dailyTotal) {
            $dailyStats[] = Stat::make("Total Día " . Carbon::today()->toDateString(), '$' . number_format($dailyTotal->total_price, 2));
        } else {
            $dailyStats[] = Stat::make("Total Día " . Carbon::today()->toDateString(), '$0.00');
        }

        // Devolver las estadísticas mensuales
        // return [$monthlyStats, $dailyStats];
        return array_merge($dailyStats, $monthlyStats);
    }
}
