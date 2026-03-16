<?php

namespace App\Support;

use App\Support\AdminRichEditor;
use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\Repeater;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TagsInput;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Components\Tabs;
use Filament\Schemas\Components\Tabs\Tab;
use InvalidArgumentException;

class HomepageSectionSchemas
{
    public static function sectionLabel(string $section): string
    {
        return match ($section) {
            'hero' => 'ჰერო სექცია',
            'about' => 'ჩვენს შესახებ',
            'contact' => 'კონტაქტი',
            'footer' => 'ფუთერი',
            default => throw new InvalidArgumentException("Unknown homepage section [{$section}]."),
        };
    }

    public static function sectionDescription(string $section): string
    {
        return match ($section) {
            'hero' => 'მართე მთავარი ბლოკის სათაური, აღწერა, ლოკაცია და სტატისტიკა.',
            'about' => 'შეცვალე ტექსტები, სტატისტიკა, გალერეა და უპირატესობები.',
            'contact' => 'განაახლე საკონტაქტო ინფორმაცია, სამუშაო საათები და სოციალური ბმულები.',
            'footer' => 'მართე footer-ის ბრენდინგი, აღწერა და პოპულარული მიმართულებები.',
            default => throw new InvalidArgumentException("Unknown homepage section [{$section}]."),
        };
    }

    /**
     * @return array<string>
     */
    public static function sectionFields(string $section): array
    {
        return array_map(
            fn (string $locale): string => "{$section}_{$locale}",
            array_keys(AdminContentLocale::all()),
        );
    }

    public static function localeTabsForSection(string $section): Tabs
    {
        return Tabs::make('ენების მიხედვით კონტენტი')
            ->activeTab(AdminContentLocale::activeTab())
            ->tabs(
                collect(AdminContentLocale::all())
                    ->map(fn (string $label, string $locale): Tab => self::localeTabForSection($section, $locale, $label))
                    ->values()
                    ->all(),
            )
            ->columnSpanFull();
    }

    public static function makeSection(string $section, string $locale): Section
    {
        return match ($section) {
            'hero' => self::heroSection($locale),
            'about' => self::aboutSection($locale),
            'contact' => self::contactSection($locale),
            'footer' => self::footerSection($locale),
            default => throw new InvalidArgumentException("Unknown homepage section [{$section}]."),
        };
    }

    protected static function localeTabForSection(string $section, string $locale, string $label): Tab
    {
        return Tab::make($label)
            ->schema([
                self::makeSection($section, $locale),
            ]);
    }

    protected static function heroSection(string $locale): Section
    {
        return Section::make('ჰერო სექცია')
            ->description('ეს ბლოკი ჩანს მთავარ გვერდზე პირველივე ეკრანზე.')
            ->columns(2)
            ->schema([
                TextInput::make("hero_{$locale}.badge")->label('ბეიჯი'),
                TextInput::make("hero_{$locale}.location")->label('ლოკაცია'),
                TextInput::make("hero_{$locale}.title1")->label('სათაურის პირველი ხაზი'),
                TextInput::make("hero_{$locale}.title2")->label('სათაურის მეორე ხაზი'),
                AdminRichEditor::compact("hero_{$locale}.description")
                    ->label('აღწერა')
                    ->columnSpanFull(),
                Repeater::make("hero_{$locale}.stats")
                    ->label('სტატისტიკა')
                    ->schema([
                        TextInput::make('value')->label('მნიშვნელობა')->required(),
                        TextInput::make('label')->label('დასახელება')->required(),
                    ])
                    ->columns(2)
                    ->default([])
                    ->columnSpanFull(),
            ]);
    }

    protected static function aboutSection(string $locale): Section
    {
        return Section::make('ჩვენს შესახებ')
            ->description('შეავსე ტექსტები, ფოტოები და ქვედა feature ბარათები.')
            ->columns(2)
            ->schema([
                TextInput::make("about_{$locale}.badge")->label('ბეიჯი'),
                TextInput::make("about_{$locale}.title1")->label('სათაურის პირველი ხაზი'),
                TextInput::make("about_{$locale}.title2")->label('სათაურის მეორე ხაზი'),
                AdminRichEditor::compact("about_{$locale}.description")
                    ->label('აღწერა')
                    ->columnSpanFull(),
                Repeater::make("about_{$locale}.stats")
                    ->label('სტატისტიკა')
                    ->schema([
                        TextInput::make('value')->label('მნიშვნელობა')->required(),
                        TextInput::make('label')->label('დასახელება')->required(),
                    ])
                    ->columns(2)
                    ->default([])
                    ->columnSpanFull(),
                Repeater::make("about_{$locale}.gallery")
                    ->label('ფოტო გალერეა')
                    ->schema([
                        FileUpload::make('src')
                            ->label('სურათი')
                            ->disk('public')
                            ->directory('cms/gallery')
                            ->visibility('public')
                            ->image()
                            ->previewable()
                            ->openable()
                            ->downloadable()
                            ->imagePreviewHeight('180')
                            ->imageEditor()
                            ->required(),
                        TextInput::make('alt')->label('Alt ტექსტი')->required(),
                    ])
                    ->default([])
                    ->columnSpanFull(),
                Repeater::make("about_{$locale}.features")
                    ->label('უპირატესობები')
                    ->schema([
                        Select::make('icon')
                            ->label('იკონა')
                            ->options([
                                'building2' => 'შენობა',
                                'users' => 'მომხმარებლები',
                                'shield' => 'უსაფრთხოება',
                                'award' => 'ჯილდო',
                            ])
                            ->required(),
                        TextInput::make('title')->label('სათაური')->required(),
                        AdminRichEditor::compact('description')->label('აღწერა')->required(),
                    ])
                    ->default([])
                    ->columnSpanFull(),
            ]);
    }

    protected static function contactSection(string $locale): Section
    {
        return Section::make('კონტაქტი')
            ->description('აქედან იმართება საკონტაქტო ბლოკები და სოციალური ქსელები.')
            ->columns(2)
            ->schema([
                TextInput::make("contact_{$locale}.badge")->label('ბეიჯი'),
                TextInput::make("contact_{$locale}.title1")->label('სათაურის პირველი ხაზი'),
                TextInput::make("contact_{$locale}.title2")->label('სათაურის მეორე ხაზი'),
                AdminRichEditor::compact("contact_{$locale}.description")->label('აღწერა')->columnSpanFull(),
                TextInput::make("contact_{$locale}.addressLabel")->label('მისამართის სათაური'),
                TextInput::make("contact_{$locale}.addressValue")->label('მისამართი'),
                TextInput::make("contact_{$locale}.addressNote")->label('მისამართის შენიშვნა'),
                TextInput::make("contact_{$locale}.phoneLabel")->label('ტელეფონის სათაური'),
                TextInput::make("contact_{$locale}.phone")->label('ტელეფონი'),
                TextInput::make("contact_{$locale}.emailLabel")->label('ელ. ფოსტის სათაური'),
                TextInput::make("contact_{$locale}.email")->label('ელ. ფოსტა')->email(),
                TextInput::make("contact_{$locale}.hoursLabel")->label('სამუშაო საათების სათაური'),
                TextInput::make("contact_{$locale}.terminalLabel")->label('ტერმინალის სათაური'),
                TextInput::make("contact_{$locale}.terminalHours")->label('ტერმინალის საათები'),
                TextInput::make("contact_{$locale}.infoDeskLabel")->label('საინფორმაციოს სათაური'),
                TextInput::make("contact_{$locale}.infoDeskHours")->label('საინფორმაციოს საათები'),
                TextInput::make("contact_{$locale}.followUsLabel")->label('სოციალური ქსელების სათაური'),
                TextInput::make("contact_{$locale}.facebookUrl")->label('Facebook ბმული')->url()->columnSpanFull(),
                TextInput::make("contact_{$locale}.instagramUrl")->label('Instagram ბმული')->url()->columnSpanFull(),
            ]);
    }

    protected static function footerSection(string $locale): Section
    {
        return Section::make('ფუთერი')
            ->description('ქვედა ბლოკის ბრენდირება და ბმულები.')
            ->columns(2)
            ->schema([
                TextInput::make("footer_{$locale}.brandTitle")->label('ბრენდის სათაური'),
                TextInput::make("footer_{$locale}.brandSubtitle")->label('ბრენდის ქვესათაური'),
                AdminRichEditor::compact("footer_{$locale}.description")
                    ->label('აღწერა')
                    ->columnSpanFull(),
                TextInput::make("footer_{$locale}.privacyLabel")->label('კონფიდენციალურობის ტექსტი'),
                TextInput::make("footer_{$locale}.termsLabel")->label('წესებისა და პირობების ტექსტი'),
                TagsInput::make("footer_{$locale}.popularRoutes")
                    ->label('პოპულარული მიმართულებები')
                    ->separator(',')
                    ->columnSpanFull(),
            ]);
    }
}
