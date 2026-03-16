<?php

namespace App\Filament\Resources\Pages;

use App\Filament\Resources\Pages\Pages\CreatePage;
use App\Filament\Resources\Pages\Pages\EditPage;
use App\Filament\Resources\Pages\Pages\ManagePages;
use App\Models\Page;
use App\Support\AdminContentLocale;
use App\Support\AdminFormLayout;
use App\Support\AdminRichEditor;
use App\Support\AdminSeoSchema;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Hidden;
use Filament\Forms\Components\Placeholder;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Infolists\Components\TextEntry;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use Filament\Schemas\Components\Utilities\Get;
use Filament\Schemas\Components\Utilities\Set;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;

class PageResource extends Resource
{
    protected static ?string $model = Page::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDocumentText;

    protected static string|\UnitEnum|null $navigationGroup = 'კონტენტი';

    protected static ?string $modelLabel = 'გვერდი';

    protected static ?string $pluralModelLabel = 'გვერდები';

    protected static ?string $navigationLabel = 'გვერდები და მენიუ';

    protected static ?int $navigationSort = 1;

    public static function form(Schema $schema): Schema
    {
        return AdminFormLayout::apply($schema, [
            Hidden::make('page_type')->default('custom'),
            AdminFormLayout::mainSection(
                'გვერდის კონტენტი',
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
            )->visible(fn (Get $get): bool => self::isCustomPage($get)),
            AdminFormLayout::mainSection(
                'სისტემური გვერდის მართვა',
                [
                    Placeholder::make('system_page_note')
                        ->hiddenLabel()
                        ->content('ეს სისტემური გვერდია. მის საჯარო კონტენტს მართავ შესაბამისი კომპონენტების ან ცალკე რესურსების გვერდებიდან, ხოლო აქედან აკონტროლებ SEO სათაურს, აღწერას, keywords-ს და გაზიარების სურათს.'),
                ],
            )->visible(fn (Get $get): bool => ! self::isCustomPage($get)),
            AdminFormLayout::mainSection(
                'SEO და გაზიარება',
                [
                    AdminSeoSchema::localeTabs(),
                ],
            ),
            AdminFormLayout::sidebarSection('მენიუ და გამოქვეყნება', [
                Toggle::make('published')->label('გამოქვეყნებულია')->default(true),
                Toggle::make('show_in_navigation')
                    ->label('აჩვენე ნავიგაციაში')
                    ->default(true)
                    ->helperText('ჩართვის შემთხვევაში გვერდი ავტომატურად გამოჩნდება public მენიუში.'),
                Toggle::make('noindex')->label('არ დააინდექსოს საძიებო სისტემებში')->default(false),
                TextInput::make('sort_order')->label('დალაგების რიგი')->numeric()->default(0),
            ]),
            AdminFormLayout::sidebarSection('ბმული და სურათები', [
                TextInput::make('slug')
                    ->label('Slug / URL')
                    ->required()
                    ->unique(ignoreRecord: true)
                    ->disabled(fn (Get $get): bool => ! self::isCustomPage($get)),
                Placeholder::make('route_path_preview')
                    ->label('საჯარო მისამართი')
                    ->content(fn (?Page $record, Get $get): string => self::publicPathPreview($record, $get)),
                Placeholder::make('page_type_preview')
                    ->label('გვერდის ტიპი')
                    ->content(fn (?Page $record, Get $get): string => self::pageTypeLabel($record?->page_type ?? $get('page_type'))),
                FileUpload::make('cover_image_url')
                    ->label('ქავერ სურათი')
                    ->disk('public')
                    ->directory('cms/pages')
                    ->visibility('public')
                    ->image()
                    ->imageEditor(),
                FileUpload::make('seo_image_url')
                    ->label('SEO / სოციალური გაზიარების სურათი')
                    ->disk('public')
                    ->directory('cms/pages')
                    ->visibility('public')
                    ->image()
                    ->imageEditor(),
            ]),
        ]);
    }

    public static function infolist(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('slug')->label('Slug'),
                TextEntry::make(AdminContentLocale::field('title'))->label('სათაური'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make(AdminContentLocale::field('title'))->label('სათაური')->searchable(),
                TextColumn::make('page_type')
                    ->label('ტიპი')
                    ->badge()
                    ->formatStateUsing(fn (string $state): string => self::pageTypeLabel($state)),
                TextColumn::make('route_path')->label('Public path')->searchable(),
                TextColumn::make('slug')->label('Slug')->searchable(),
                IconColumn::make('published')->label('გამოქვეყნებულია')->boolean(),
                IconColumn::make('noindex')->label('Noindex')->boolean(),
                IconColumn::make('show_in_navigation')->boolean()->label('ნავიგაციაში'),
                TextColumn::make('sort_order')->label('რიგი')->sortable(),
            ])
            ->filters([
                //
            ])
            ->defaultSort('sort_order')
            ->recordActions([
                Action::make('edit')
                    ->label('რედაქტირება')
                    ->icon(Heroicon::OutlinedPencilSquare)
                    ->color('primary')
                    ->url(fn (Page $record): string => static::getUrl('edit', ['record' => $record])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManagePages::route('/'),
            'create' => CreatePage::route('/create'),
            'edit' => EditPage::route('/{record}/edit'),
        ];
    }

    protected static function localeTab(string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                TextInput::make("title_{$locale}")
                    ->label('სათაური')
                    ->required()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function (?string $state, Get $get, Set $set) use ($locale): void {
                        $navField = "nav_label_{$locale}";

                        if (blank($get($navField))) {
                            $set($navField, $state ?? '');
                        }
                    })
                    ->columnSpanFull()
                    ->extraInputAttributes([
                        'class' => 'bt-admin-title-input',
                    ]),
                Textarea::make("excerpt_{$locale}")
                    ->label('მოკლე აღწერა')
                    ->rows(4)
                    ->columnSpanFull()
                    ->extraInputAttributes([
                        'class' => 'bt-admin-excerpt-input',
                    ])
                    ->visible(fn (Get $get): bool => self::isCustomPage($get)),
                TextInput::make("nav_label_{$locale}")
                    ->label('ნავიგაციის დასახელება')
                    ->required()
                    ->columnSpanFull()
                    ->helperText('ეს ტექსტი გამოჩნდება public საიტის მენიუში, თუ გვერდს ჩართული აქვს "აჩვენე ნავიგაციაში".'),
                AdminRichEditor::make("content_{$locale}")
                    ->label('კონტენტი')
                    ->required()
                    ->helperText('აქ ჩაწერე გვერდის ძირითადი ტექსტი რედაქტორით.')
                    ->visible(fn (Get $get): bool => self::isCustomPage($get)),
            ]);
    }

    protected static function isCustomPage(Get $get): bool
    {
        return ($get('page_type') ?? 'custom') === 'custom';
    }

    protected static function pageTypeLabel(?string $pageType): string
    {
        return $pageType === 'system' ? 'სისტემური გვერდი' : 'კასტომ გვერდი';
    }

    protected static function publicPathPreview(?Page $record, Get $get): string
    {
        if (filled($record?->route_path)) {
            return (string) $record->route_path;
        }

        $slug = trim((string) ($get('slug') ?? ''));
        $pageType = $record?->page_type ?? $get('page_type') ?? 'custom';

        if ($pageType === 'system') {
            return $slug === 'home' ? '/' : "/{$slug}";
        }

        return filled($slug) ? "/page/{$slug}" : '/page/your-page-slug';
    }
}
