<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('blog_posts', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('title_ka');
            $table->string('title_en');
            $table->string('title_ru');
            $table->text('excerpt_ka')->nullable();
            $table->text('excerpt_en')->nullable();
            $table->text('excerpt_ru')->nullable();
            $table->longText('content_ka');
            $table->longText('content_en');
            $table->longText('content_ru');
            $table->string('cover_image_url')->nullable();
            $table->string('author_name');
            $table->timestamp('published_at')->nullable();
            $table->boolean('published')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('blog_posts');
    }
};
