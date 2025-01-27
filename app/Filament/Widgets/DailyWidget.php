<?php

namespace App\Filament\Widgets;

use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use App\Models\Data;
use App\Models\Sensor;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class DailyWidget extends BaseWidget
{
    protected function getStats(): array
    {
        // Obtener el total por día (solo el día actual)
        $dailyTotals = Data::select(
            DB::raw('DATE(start_time) as date'),
            'sensor_id',
            DB::raw('SUM(price) as total_price')
        )
            ->whereDate('start_time', Carbon::today()) // Filtra solo los datos del día actual
            ->groupBy(DB::raw('DATE(start_time)'), 'sensor_id')
            ->get(); // Obtener los resultados del día actual

        // Agrupar los totales diarios por cada sensor
        $dailyStats = [];

        // Ordenar los totales diarios por nombre de sensor
        $dailyTotals = $dailyTotals->sortBy(function ($item) {
            return Sensor::find($item->sensor_id)->name;
        });

        foreach ($dailyTotals as $item) {
            $sensorName = Sensor::find($item->sensor_id)->name;
            $dailyStats[] = Stat::make("{$sensorName} - Día {$item->date}", '$' . number_format($item->total_price, 2));
        }

        // Devolver solo las estadísticas del día actual
        return $dailyStats;
    }
}
