<?php

namespace App\Filament\Resources\Partners;

use App\Filament\Resources\Partners\Pages\CreatePartner;
use App\Filament\Resources\Partners\Pages\EditPartner;
use App\Filament\Resources\Partners\Pages\ManagePartners;
use App\Models\Partner;
use App\Support\AdminContentLocale;
use App\Support\AdminFormLayout;
use App\Support\AdminRichEditor;
use App\Support\AdminSeoSchema;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;

class PartnerResource extends Resource
{
    protected static ?string $model = Partner::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedBuildingOffice2;

    protected static string|\UnitEnum|null $navigationGroup = 'მთავარი გვერდი';

    protected static ?string $modelLabel = 'პარტნიორი';

    protected static ?string $pluralModelLabel = 'პარტნიორები';

    protected static ?string $navigationLabel = 'პარტნიორები';

    protected static ?int $navigationSort = 5;

    public static function form(Schema $schema): Schema
    {
        return AdminFormLayout::apply($schema, [
            AdminFormLayout::mainSection(
                'პარტნიორის აღწერა',
                [
                    Tabs::make('ენების მიხედვით კონტენტი')
                        ->activeTab(AdminContentLocale::activeTab())
                        ->tabs([
                            self::localeTab('ka', 'ქართული'),
                            self::localeTab('en', 'English'),
                            self::localeTab('ru', 'Русский'),
                        ])
                        ->columnSpanFull(),
                ],
                'აქ იმართება პარტნიორის აღწერა და მიმართულებების ჩამონათვალი. აღწერის ველები უკვე rich editor-ზეა.',
            ),
            AdminFormLayout::sidebarSection('ძირითადი პარამეტრები', [
                TextInput::make('name')->label('სახელი')->required(),
                TextInput::make('website')->label('ვებსაიტი')->url(),
                Placeholder::make('route_path_preview')
                    ->label('პარტნიორის გვერდი')
                    ->content('საჯარო URL ავტომატურად გენერირდება პარტნიორის სახელიდან.'),
            ]),
            AdminFormLayout::mainSection(
                'SEO და გაზიარება',
                [
                    AdminSeoSchema::localeTabs(),
                ],
                'პარტნიორის detail გვერდისთვის შეგიძლია ცალკე SEO title/description/keywords მიუთითო.',
            ),
            AdminFormLayout::sidebarSection('გამოქვეყნება', [
                Toggle::make('published')->label('გამოქვეყნებულია')->default(true),
                Toggle::make('noindex')->label('არ დააინდექსოს საძიებო სისტემებში')->default(false),
                TextInput::make('sort_order')->label('დალაგების რიგი')->numeric()->default(0),
            ]),
            AdminFormLayout::sidebarSection('სურათები', [
                FileUpload::make('logo_url')
                    ->label('ლოგო')
                    ->disk('public')
                    ->directory('cms/partners')
                    ->visibility('public')
                    ->image()
                    ->previewable()
                    ->openable()
                    ->downloadable()
                    ->imagePreviewHeight('180')
                    ->imageEditor(),
                FileUpload::make('seo_image_url')
                    ->label('SEO / სოციალური გაზიარების სურათი')
                    ->disk('public')
                    ->directory('cms/partners')
                    ->visibility('public')
                    ->image()
                    ->previewable()
                    ->openable()
                    ->downloadable()
                    ->imagePreviewHeight('180')
                    ->imageEditor(),
            ]),
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name')->label('სახელი'),
                TextEntry::make('website')->label('ვებსაიტი'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')->label('სახელი')->searchable(),
                TextColumn::make('website')->label('ვებსაიტი')->limit(30),
                IconColumn::make('noindex')->label('Noindex')->boolean(),
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
                    ->url(fn (Partner $record): string => static::getUrl('edit', ['record' => $record])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePartners::route('/'),
            'create' => CreatePartner::route('/create'),
            'edit' => EditPartner::route('/{record}/edit'),
        ];
    }

    protected static function localeTab(string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                AdminRichEditor::compact("description_{$locale}")->label('აღწერა')->required(),
                Textarea::make("routes_{$locale}")->label('მარშრუტები')->required()->rows(2),
            ]);
    }
}
