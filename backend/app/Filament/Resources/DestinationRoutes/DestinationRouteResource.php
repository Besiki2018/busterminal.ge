<?php

namespace App\Filament\Resources\DestinationRoutes;

use App\Filament\Resources\DestinationRoutes\Pages\CreateDestinationRoute;
use App\Filament\Resources\DestinationRoutes\Pages\EditDestinationRoute;
use App\Filament\Resources\DestinationRoutes\Pages\ManageDestinationRoutes;
use App\Models\DestinationRoute;
use App\Support\AdminContentLocale;
use App\Support\AdminFormLayout;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;

class DestinationRouteResource extends Resource
{
    protected static ?string $model = DestinationRoute::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedMap;

    protected static string|\UnitEnum|null $navigationGroup = 'მთავარი გვერდი';

    protected static ?string $modelLabel = 'მიმართულება';

    protected static ?string $pluralModelLabel = 'მიმართულებები';

    protected static ?string $navigationLabel = 'მიმართულებები';

    protected static ?int $navigationSort = 3;

    public static function form(Schema $schema): Schema
    {
        return AdminFormLayout::apply($schema, [
            AdminFormLayout::mainSection(
                'მარშრუტის კონტენტი',
                [
                    Tabs::make('ენების მიხედვით კონტენტი')
                        ->activeTab(AdminContentLocale::activeTab())
                        ->tabs([
                            self::localeTab('ka', 'ქართული'),
                            self::localeTab('en', 'English'),
                            self::localeTab('ru', 'Русский'),
                        ])
                        ->columnSpanFull(),
                    Repeater::make('provider_links')
                        ->label('ბილეთის/კომპანიის ბმულები')
                        ->schema([
                            TextInput::make('name')->label('სახელი')->required(),
                            TextInput::make('url')->label('ბმული')->required()->url(),
                        ])
                        ->columns(2)
                        ->default([])
                        ->columnSpanFull(),
                ],
                'აქ იმართება მიმართულების სახელები ენების მიხედვით და შესაბამისი ბილეთების ბმულები.',
            ),
            AdminFormLayout::sidebarSection('ძირითადი პარამეტრები', [
                TextInput::make('slug')->label('Slug / URL')->required()->unique(ignoreRecord: true),
                Select::make('route_type')
                    ->label('მიმართულების ტიპი')
                    ->options([
                        'domestic' => 'შიდა',
                        'international' => 'საერთაშორისო',
                    ])
                    ->required(),
                TextInput::make('duration')->label('ხანგრძლივობა'),
                TextInput::make('price_from')->label('ფასი'),
            ]),
            AdminFormLayout::sidebarSection('გამოქვეყნება', [
                Toggle::make('show_in_footer')->label('აჩვენე footer-ში'),
                Toggle::make('published')->label('გამოქვეყნებულია')->default(true),
                TextInput::make('sort_order')->label('დალაგების რიგი')->numeric()->default(0),
            ]),
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('slug')->label('Slug'),
                TextEntry::make(AdminContentLocale::field('city'))->label('ქალაქი'),
                TextEntry::make('route_type')->label('ტიპი'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('slug')->label('Slug')->searchable(),
                TextColumn::make(AdminContentLocale::field('city'))->label('ქალაქი')->searchable(),
                TextColumn::make('route_type')
                    ->label('ტიპი')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => $state === 'international' ? 'საერთაშორისო' : 'შიდა'),
                IconColumn::make('published')->label('გამოქვეყნებულია')->boolean(),
                TextColumn::make('sort_order')->label('რიგი')->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Action::make('edit')
                    ->label('რედაქტირება')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->color('primary')
                    ->url(fn (DestinationRoute $record): string => static::getUrl('edit', ['record' => $record])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageDestinationRoutes::route('/'),
            'create' => CreateDestinationRoute::route('/create'),
            'edit' => EditDestinationRoute::route('/{record}/edit'),
        ];
    }

    protected static function localeTab(string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                TextInput::make("city_{$locale}")->label('ქალაქი')->required(),
                TextInput::make("country_{$locale}")->label('ქვეყანა'),
            ]);
    }
}
