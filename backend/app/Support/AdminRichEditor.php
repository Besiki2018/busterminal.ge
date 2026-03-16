<?php

namespace App\Support;

use Filament\Forms\Components\RichEditor;

class AdminRichEditor
{
    public static function make(string $name): RichEditor
    {
        return self::configure(
            RichEditor::make($name),
            compact: false,
        );
    }

    public static function compact(string $name): RichEditor
    {
        return self::configure(
            RichEditor::make($name),
            compact: true,
        );
    }

    protected static function configure(RichEditor $editor, bool $compact): RichEditor
    {
        return $editor
            ->toolbarButtons([
                $compact ? ['bold', 'italic', 'underline'] : ['h1', 'h2', 'h3'],
                $compact ? ['bulletList', 'orderedList', 'link'] : ['bold', 'italic', 'underline', 'strike'],
                ...($compact ? [] : [['alignStart', 'alignCenter', 'alignEnd']]),
                ...($compact ? [] : [['bulletList', 'orderedList', 'blockquote']]),
                ['link', 'attachFiles', 'horizontalRule', 'clearFormatting'],
                ['undo', 'redo'],
            ])
            ->fileAttachmentsDirectory('cms/editor')
            ->fileAttachmentsDisk('public')
            ->fileAttachmentsVisibility('public')
            ->fileAttachments(true)
            ->extraAttributes([
                'class' => $compact ? 'bt-rich-editor-compact' : 'bt-rich-editor-main',
            ])
            ->extraInputAttributes([
                'class' => $compact ? 'bt-rich-editor-compact' : 'bt-rich-editor-main',
            ])
            ->columnSpanFull();
    }
}
