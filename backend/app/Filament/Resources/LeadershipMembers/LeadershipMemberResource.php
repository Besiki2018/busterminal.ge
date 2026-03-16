<?php

namespace App\Filament\Resources\LeadershipMembers;

use App\Filament\Resources\LeadershipMembers\Pages\CreateLeadershipMember;
use App\Filament\Resources\LeadershipMembers\Pages\EditLeadershipMember;
use App\Filament\Resources\LeadershipMembers\Pages\ManageLeadershipMembers;
use App\Models\LeadershipMember;
use App\Support\AdminFormLayout;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;

class LeadershipMemberResource extends Resource
{
    protected static ?string $model = LeadershipMember::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedUsers;

    protected static string|\UnitEnum|null $navigationGroup = 'მთავარი გვერდი';

    protected static ?string $modelLabel = 'ხელმძღვანელი';

    protected static ?string $pluralModelLabel = 'ხელმძღვანელობა';

    protected static ?string $navigationLabel = 'ხელმძღვანელობა';

    protected static ?int $navigationSort = 6;

    public static function form(Schema $schema): Schema
    {
        return AdminFormLayout::apply($schema, [
            AdminFormLayout::mainSection(
                'ხელმძღვანელის პროფილი',
                [
                    Section::make('საკონტაქტო ინფორმაცია')
                        ->columns(2)
                        ->schema([
                            TextInput::make('name')->label('სახელი და გვარი')->required()->columnSpanFull(),
                            TextInput::make('phone')->label('ტელეფონი')->required(),
                            TextInput::make('linkedin')->label('LinkedIn')->url(),
                        ]),
                ],
                'მარცხენა მხარეს ჩანს პროფილის ძირითადი ინფორმაცია, ხოლო მარჯვნივ სტატუსი და პოზიცია.',
            ),
            AdminFormLayout::sidebarSection('პოზიცია და სტატუსი', [
                Select::make('role_key')
                    ->label('პოზიცია')
                    ->options(self::roleOptions())
                    ->required(),
                Toggle::make('whatsapp_enabled')->label('WhatsApp ჩართულია')->default(true),
                Toggle::make('published')->label('გამოქვეყნებულია')->default(true),
                TextInput::make('sort_order')->label('დალაგების რიგი')->numeric()->default(0),
            ]),
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name')->label('სახელი'),
                TextEntry::make('role_key')
                    ->label('პოზიცია')
                    ->formatStateUsing(fn (string $state): string => self::roleOptions()[$state] ?? $state),
                TextEntry::make('phone')->label('ტელეფონი'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('სახელი')->searchable(),
                TextColumn::make('role_key')
                    ->label('პოზიცია')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => self::roleOptions()[$state] ?? $state),
                TextColumn::make('phone')->label('ტელეფონი'),
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
                    ->url(fn (LeadershipMember $record): string => static::getUrl('edit', ['record' => $record])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageLeadershipMembers::route('/'),
            'create' => CreateLeadershipMember::route('/create'),
            'edit' => EditLeadershipMember::route('/{record}/edit'),
        ];
    }

    /**
     * @return array<string, string>
     */
    protected static function roleOptions(): array
    {
        return [
            'chairman' => 'თავმჯდომარე',
            'deputyChairman' => 'თავმჯდომარის მოადგილე',
            'ceo' => 'გენერალური დირექტორი',
            'deputyCeo' => 'გენერალური დირექტორის მოადგილე',
            'coo' => 'ოპერაციების დირექტორი',
            'chiefAccountant' => 'მთავარი ბუღალტერი',
        ];
    }
}
