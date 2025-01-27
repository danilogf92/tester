<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SensorResource\Pages;
use App\Filament\Resources\SensorResource\RelationManagers;
use App\Models\Sensor;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SensorResource extends Resource
{
    protected static ?string $model = Sensor::class;

    protected static ?string $navigationIcon = 'heroicon-o-presentation-chart-line';

    protected static ?string $navigationLabel = 'Plazas';

    protected static ?string $navigationGroup = 'Parqueadero';

    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Parqueadero')
                    ->required()
                    ->maxLength(255),
                // Forms\Components\Toggle::make('occupied')
                //     ->required()
                //     ->label('Ocupado'),
                // Forms\Components\DateTimePicker::make('start_time')
                //     ->label('Fecha inicio'),
                // Forms\Components\DateTimePicker::make('end_time')
                //     ->label('Fecha Finalización'),
                // Forms\Components\TextInput::make('user_id')
                //     ->label('Usuario')
                //     ->numeric()
                //     ->default(null),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Parqueadero')
                    ->searchable(),
                Tables\Columns\IconColumn::make('occupied')
                    ->label('Ocupado')
                    ->boolean(),
                Tables\Columns\TextColumn::make('start_time')
                    ->label('Fecha inicio')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('end_time')
                    ->label('Fecha Finalización')
                    ->dateTime()
                    ->sortable(),
                Tables\Columns\TextColumn::make('user.name')
                    ->label('Usuario')
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Creado a las')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Actualizado a las')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSensors::route('/'),
            'create' => Pages\CreateSensor::route('/create'),
            'edit' => Pages\EditSensor::route('/{record}/edit'),
        ];
    }
}
