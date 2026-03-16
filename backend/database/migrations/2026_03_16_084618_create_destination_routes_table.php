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
        Schema::create('destination_routes', function (Blueprint $table) {
            $table->id();
            $table->string('slug')->unique();
            $table->string('route_type');
            $table->string('city_ka');
            $table->string('city_en');
            $table->string('city_ru');
            $table->string('country_ka')->nullable();
            $table->string('country_en')->nullable();
            $table->string('country_ru')->nullable();
            $table->string('duration')->nullable();
            $table->string('price_from')->nullable();
            $table->json('provider_links')->nullable();
            $table->boolean('show_in_footer')->default(false);
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
        Schema::dropIfExists('destination_routes');
    }
};
