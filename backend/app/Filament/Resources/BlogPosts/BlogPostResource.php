<?php

namespace App\Filament\Resources\BlogPosts;

use App\Filament\Resources\BlogPosts\Pages\CreateBlogPost;
use App\Filament\Resources\BlogPosts\Pages\EditBlogPost;
use App\Filament\Resources\BlogPosts\Pages\ManageBlogPosts;
use App\Models\BlogPost;
use App\Support\AdminContentLocale;
use App\Support\AdminFormLayout;
use App\Support\AdminRichEditor;
use App\Support\AdminSeoSchema;
use BackedEnum;
use Filament\Actions\Action;
use Filament\Forms\Components\DateTimePicker;
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

class BlogPostResource extends Resource
{
    protected static ?string $model = BlogPost::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedNewspaper;

    protected static string|\UnitEnum|null $navigationGroup = 'კონტენტი';

    protected static ?string $modelLabel = 'ბლოგ პოსტი';

    protected static ?string $pluralModelLabel = 'ბლოგ პოსტები';

    protected static ?string $navigationLabel = 'ბლოგი';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return AdminFormLayout::apply($schema, [
            AdminFormLayout::mainSection(
                'პოსტის კონტენტი',
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
                'მარცხენა მხარეს წერ პოსტს და ამუშავებ ტექსტს, მარჯვენა მხარეს კი publish/meta ბლოკებია, როგორც WordPress-ის post editor-ში.',
            ),
            AdminFormLayout::mainSection(
                'SEO და გაზიარება',
                [
                    AdminSeoSchema::localeTabs(),
                ],
                'SEO სათაური, აღწერა და keywords შეგიძლია ცალკე მართო თითოეული ენისთვის.',
            ),
            AdminFormLayout::sidebarSection('გამოქვეყნება', [
                DateTimePicker::make('published_at')->label('გამოქვეყნების თარიღი')->default(now()),
                Toggle::make('published')->label('გამოქვეყნებულია')->default(true),
                Toggle::make('noindex')->label('არ დააინდექსოს საძიებო სისტემებში')->default(false),
                TextInput::make('sort_order')->label('დალაგების რიგი')->numeric()->default(0),
            ]),
            AdminFormLayout::sidebarSection('ავტორი და ბმული', [
                TextInput::make('author_name')->label('ავტორი')->required(),
                TextInput::make('slug')->label('Slug / URL')->required()->unique(ignoreRecord: true),
                Placeholder::make('route_path_preview')
                    ->label('საჯარო მისამართი')
                    ->content(fn (?BlogPost $record): string => filled($record?->slug) ? "/blog/{$record->slug}" : '/blog/your-post-slug'),
            ]),
            AdminFormLayout::sidebarSection('სურათები', [
                FileUpload::make('cover_image_url')
                    ->label('ქავერ სურათი')
                    ->disk('public')
                    ->directory('cms/blog')
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
                    ->directory('cms/blog')
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
                TextEntry::make('slug')->label('Slug'),
                TextEntry::make(AdminContentLocale::field('title'))->label('სათაური'),
                TextEntry::make('author_name')->label('ავტორი'),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make(AdminContentLocale::field('title'))->label('სათაური')->searchable(),
                TextColumn::make('author_name')->label('ავტორი')->searchable(),
                IconColumn::make('noindex')->label('Noindex')->boolean(),
                TextColumn::make('published_at')->label('გამოქვეყნების თარიღი')->dateTime()->sortable(),
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
                    ->url(fn (BlogPost $record): string => static::getUrl('edit', ['record' => $record])),
            ]);
    }

    public static function getPages(): array
    {
        return [
            'index' => ManageBlogPosts::route('/'),
            'create' => CreateBlogPost::route('/create'),
            'edit' => EditBlogPost::route('/{record}/edit'),
        ];
    }

    protected static function localeTab(string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                TextInput::make("title_{$locale}")
                    ->label('სათაური')
                    ->required()
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
                    ]),
                AdminRichEditor::make("content_{$locale}")->label('კონტენტი')->required(),
            ]);
    }
}
