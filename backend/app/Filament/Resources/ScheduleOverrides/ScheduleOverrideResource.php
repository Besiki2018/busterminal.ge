<?php

namespace App\Filament\Resources\ScheduleOverrides;

use App\Filament\Resources\ScheduleOverrides\Pages\CreateScheduleOverride;
use App\Filament\Resources\ScheduleOverrides\Pages\EditScheduleOverride;
use App\Filament\Resources\ScheduleOverrides\Pages\ManageScheduleOverrides;
use App\Models\ScheduleOverride;
use App\Support\AdminContentLocale;
use App\Support\AdminFormLayout;
use BackedEnum;
use Filament\Actions\Action;
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

class ScheduleOverrideResource extends Resource
{
    protected static ?string $model = ScheduleOverride::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCalendarDays;

    protected static string|\UnitEnum|null $navigationGroup = 'მთავარი გვერდი';

    protected static ?string $modelLabel = 'განრიგის ჩანაწერი';

    protected static ?string $pluralModelLabel = 'განრიგის ჩანაწერები';

    protected static ?string $navigationLabel = 'განრიგის ცვლილებები';

    protected static ?int $navigationSort = 4;

    public static function form(Schema $schema): Schema
    {
        return AdminFormLayout::apply($schema, [
            AdminFormLayout::mainSection(
                'მიმართულების ტექსტი',
                [
                    Tabs::make('ენების მიხედვით მიმართულება')
                        ->activeTab(AdminContentLocale::activeTab())
                        ->tabs([
                            self::localeTab('ka', 'ქართული'),
                            self::localeTab('en', 'English'),
                            self::localeTab('ru', 'Русский'),
                        ])
                        ->columnSpanFull(),
                ],
                'მარცხენა მხარეს იმართება მიმართულების დასახელება ენების მიხედვით.',
            ),
            AdminFormLayout::sidebarSection('რეისის პარამეტრები', [
                TextInput::make('departure_time')->label('გასვლის დრო')->required()->placeholder('06:00'),
                TextInput::make('operator')->label('ოპერატორი')->required(),
                TextInput::make('buy_ticket_url')->label('ბილეთის ბმული')->url(),
            ]),
            AdminFormLayout::sidebarSection('გამოქვეყნება', [
                Toggle::make('published')->label('გამოქვეყნებულია')->default(true),
                TextInput::make('sort_order')->label('დალაგების რიგი')->numeric()->default(0),
            ]),
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('departure_time')->label('გასვლის დრო'),
                TextEntry::make(AdminContentLocale::field('destination'))->label('მიმართულება'),
                TextEntry::make('operator')->label('ოპერატორი'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('departure_time')->label('დრო')->sortable(),
                TextColumn::make(AdminContentLocale::field('destination'))->label('მიმართულება')->searchable(),
                TextColumn::make('operator')->label('ოპერატორი')->searchable(),
                IconColumn::make('published')->label('გამოქვეყნებულია')->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Action::make('edit')
                    ->label('რედაქტირება')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->color('primary')
                    ->url(fn (ScheduleOverride $record): string => static::getUrl('edit', ['record' => $record])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageScheduleOverrides::route('/'),
            'create' => CreateScheduleOverride::route('/create'),
            'edit' => EditScheduleOverride::route('/{record}/edit'),
        ];
    }

    protected static function localeTab(string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                TextInput::make("destination_{$locale}")->label('მიმართულება')->required(),
            ]);
    }
}
