<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->id();

            // 🔗 ID del contrato blockchain
            $table->unsignedBigInteger('blockchain_id')->unique();

            // 🏠 Info visual (CMS)
            $table->string('title');
            $table->text('description')->nullable();

            // 🖼 imagen principal
            $table->string('image');

            // 💰 opcional (para UI futura)
            $table->decimal('price', 18, 8)->nullable();

            // 📊 estado
            $table->boolean('active')->default(true);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('properties');
    }
};
