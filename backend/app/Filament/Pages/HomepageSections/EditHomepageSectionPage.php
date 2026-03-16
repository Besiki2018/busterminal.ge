<?php

namespace App\Filament\Pages\HomepageSections;

use App\Filament\Pages\Dashboard;
use App\Models\SiteSetting;
use App\Support\HomepageSectionSchemas;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Pages\Concerns\CanUseDatabaseTransactions;
use Filament\Pages\Concerns\HasUnsavedDataChangesAlert;
use Filament\Pages\Page;
use Filament\Schemas\Components\Actions;
use Filament\Schemas\Components\Component;
use Filament\Schemas\Components\EmbeddedSchema;
use Filament\Schemas\Components\Form;
use Filament\Schemas\Schema;
use Filament\Support\Exceptions\Halt;
use Filament\Support\Facades\FilamentView;
use Illuminate\Contracts\Support\Htmlable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Throwable;

/**
 * @property-read Schema $form
 */
abstract class EditHomepageSectionPage extends Page
{
    use CanUseDatabaseTransactions;
    use HasUnsavedDataChangesAlert;

    protected static bool $shouldRegisterNavigation = true;

    protected static string|\UnitEnum|null $navigationGroup = 'მთავარი გვერდი';

    /**
     * @var array<string, mixed> | null
     */
    public ?array $data = [];

    protected ?SiteSetting $settings = null;

    abstract protected static function getSectionKey(): string;

    public function mount(): void
    {
        $this->settings = $this->getSettingsRecord();
        $this->fillForm();
    }

    public function getTitle(): string | Htmlable
    {
        return HomepageSectionSchemas::sectionLabel(static::getSectionKey());
    }

    public function getSubheading(): string | Htmlable | null
    {
        return null;
    }

    public static function getNavigationLabel(): string
    {
        return HomepageSectionSchemas::sectionLabel(static::getSectionKey());
    }

    public function getBreadcrumbs(): array
    {
        return [
            Dashboard::getUrl() => 'მართვის პანელი',
            $this->getTitle(),
        ];
    }

    protected function fillForm(): void
    {
        $this->callHook('beforeFill');
        $this->form->fill($this->getSettingsRecord()->attributesToArray());
        $this->callHook('afterFill');
    }

    public function defaultForm(Schema $schema): Schema
    {
        return $schema
            ->operation('edit')
            ->model($this->getSettingsRecord())
            ->statePath('data');
    }

    public function form(Schema $schema): Schema
    {
        return $schema
            ->components([
                HomepageSectionSchemas::localeTabsForSection(static::getSectionKey()),
            ]);
    }

    public function content(Schema $schema): Schema
    {
        return $schema
            ->components([
                $this->getFormContentComponent(),
            ]);
    }

    public function save(): void
    {
        try {
            $this->beginDatabaseTransaction();

            $this->callHook('beforeValidate');

            $data = $this->form->getState();

            $this->callHook('afterValidate');
            $this->callHook('beforeSave');

            $this->handleRecordUpdate($this->getSettingsRecord(), $data);

            $this->callHook('afterSave');
        } catch (Halt $exception) {
            $exception->shouldRollbackDatabaseTransaction()
                ? $this->rollBackDatabaseTransaction()
                : $this->commitDatabaseTransaction();

            return;
        } catch (Throwable $exception) {
            $this->rollBackDatabaseTransaction();

            throw $exception;
        }

        $this->commitDatabaseTransaction();

        Notification::make()
            ->success()
            ->title("„{$this->getTitle()}“ განახლდა")
            ->send();

        if ($redirectUrl = $this->getRedirectUrl()) {
            $this->redirect($redirectUrl, navigate: FilamentView::hasSpaMode($redirectUrl));
        }
    }

    /**
     * @param  array<string, mixed>  $data
     */
    protected function handleRecordUpdate(Model $record, array $data): Model
    {
        $record->update(
            Arr::only($data, HomepageSectionSchemas::sectionFields(static::getSectionKey())),
        );

        return $record;
    }

    protected function getRedirectUrl(): ?string
    {
        return null;
    }

    protected function getSettingsRecord(): SiteSetting
    {
        return $this->settings ??= SiteSetting::query()->firstOrCreate(
            ['key' => 'primary'],
            ['key' => 'primary'],
        );
    }

    /**
     * @return array<Action>
     */
    protected function getFormActions(): array
    {
        return [
            Action::make('back')
                ->label('უკან')
                ->color('gray')
                ->url(Dashboard::getUrl()),
            Action::make('save')
                ->label('შენახვა')
                ->submit('save')
                ->keyBindings(['mod+s']),
        ];
    }

    public function getFormContentComponent(): Component
    {
        return Form::make([EmbeddedSchema::make('form')])
            ->id('form')
            ->livewireSubmitHandler('save')
            ->footer([
                Actions::make($this->getFormActions())
                    ->alignment($this->getFormActionsAlignment())
                    ->sticky($this->areFormActionsSticky())
                    ->key('form-actions'),
            ]);
    }
}
