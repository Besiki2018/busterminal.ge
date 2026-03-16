<?php

namespace App\Filament\Resources\SiteSettings;

use App\Filament\Resources\SiteSettings\Pages\ManageSiteSettings;
use App\Support\AdminFormLayout;
use App\Models\SiteSetting;
use App\Support\AdminContentLocale;
use App\Support\HomepageSectionSchemas;
use BackedEnum;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;

class SiteSettingResource extends Resource
{
    protected static ?string $model = SiteSetting::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedCog6Tooth;

    protected static string|\UnitEnum|null $navigationGroup = 'საიტი';

    protected static ?string $modelLabel = 'საიტის პარამეტრი';

    protected static ?string $pluralModelLabel = 'საიტის პარამეტრები';

    protected static ?string $navigationLabel = 'საიტის პარამეტრები';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return AdminFormLayout::apply($schema, [
                Hidden::make('key')
                    ->required()
                    ->default('primary'),
                AdminFormLayout::mainSection(
                    'საიტის ძირითადი პარამეტრები',
                    [
                        Section::make('კონტაქტი და ლოკაცია')
                            ->description('ეს ველები ყველაზე ხშირად იცვლება და პირდაპირ მოქმედებს მთავარ გვერდსა და footer-ზე.')
                            ->columns(2)
                            ->schema([
                                TextInput::make('hero_ka.location')->label('ლოკაცია / მისამართის მოკლე ვერსია')->columnSpanFull(),
                                TextInput::make('contact_ka.addressValue')->label('სრული მისამართი')->columnSpanFull(),
                                TextInput::make('contact_ka.addressNote')->label('მისამართის დამატებითი შენიშვნა')->columnSpanFull(),
                                TextInput::make('contact_ka.phone')->label('საკონტაქტო ტელეფონი'),
                                TextInput::make('contact_ka.email')->label('საკონტაქტო ელ. ფოსტა')->email(),
                                TextInput::make('contact_ka.terminalHours')->label('ტერმინალის სამუშაო დრო'),
                                TextInput::make('contact_ka.infoDeskHours')->label('საინფორმაციოს სამუშაო დრო'),
                            ]),
                        Section::make('ბრენდი და სოციალური არხები')
                            ->columns(2)
                            ->schema([
                                TextInput::make('footer_ka.brandTitle')->label('ბრენდის სათაური'),
                                TextInput::make('footer_ka.brandSubtitle')->label('ბრენდის ქვესათაური'),
                                TextInput::make('contact_ka.facebookUrl')->label('Facebook ბმული')->url()->columnSpanFull(),
                                TextInput::make('contact_ka.instagramUrl')->label('Instagram ბმული')->url()->columnSpanFull(),
                            ]),
                    ],
                    'აქ თავმოყრილია ყველაზე საჭირო გლობალური ველები ქართული ძირითადი ვერსიისთვის.',
                ),
                AdminFormLayout::mainSection(
                    'მთავარი გვერდის კონტენტი',
                    [
                        Tabs::make('კონტენტის თარგმანები')
                            ->activeTab(AdminContentLocale::activeTab())
                            ->tabs([
                                self::makeLocaleWorkspaceTab('ka', 'ქართული'),
                                self::makeLocaleWorkspaceTab('en', 'English'),
                                self::makeLocaleWorkspaceTab('ru', 'Русский'),
                            ])
                            ->columnSpanFull(),
                    ],
                    'ჯერ აირჩიე ენა, შემდეგ კი კონკრეტული სექცია: ჰერო, ჩვენს შესახებ, კონტაქტი ან ფუთერი.',
                ),
                AdminFormLayout::sidebarSection(
                    'ინფორმაცია',
                    [
                        Placeholder::make('site_settings_primary_locale_note')
                            ->label('ძირითადი ენა')
                            ->content('ქართული გამოიყენება როგორც ძირითადი სამუშაო ვერსია. დანარჩენი ენები ქვედა თაბებიდან იმართება.'),
                        Placeholder::make('site_settings_scope')
                            ->label('რას მართავ აქედან')
                            ->content('ჰერო სექციას, ჩვენს შესახებ ბლოკს, საკონტაქტო ნაწილს და footer-ს ყველა ენაზე.'),
                        Placeholder::make('site_settings_updated_at')
                            ->label('ბოლო განახლება')
                            ->content(fn (?SiteSetting $record): string => $record?->updated_at?->format('Y-m-d H:i') ?? 'ჯერ არ განახლებულა'),
                    ],
                    'ეს გვერდი მხოლოდ მთავარ საიტზე გამოყენებულ საერთო პარამეტრებს მართავს.',
                ),
            ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('key')->label('გასაღები'),
                TextEntry::make('updated_at')->label('განახლდა')->dateTime(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('key')->label('გასაღები')->searchable(),
                TextColumn::make('updated_at')->label('განახლდა')->dateTime()->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([])
            ->toolbarActions([]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageSiteSettings::route('/'),
        ];
    }

    protected static function makeLocaleWorkspaceTab(string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                Tabs::make("{$locale}_content_sections")
                    ->tabs([
                        self::makeSectionTab('hero', $locale),
                        self::makeSectionTab('about', $locale),
                        self::makeSectionTab('contact', $locale),
                        self::makeSectionTab('footer', $locale),
                    ])
                    ->columnSpanFull(),
            ]);
    }

    protected static function makeSectionTab(string $section, string $locale): Tab
    {
        return Tab::make(HomepageSectionSchemas::sectionLabel($section))
            ->schema([
                HomepageSectionSchemas::makeSection($section, $locale),
            ]);
    }
}
