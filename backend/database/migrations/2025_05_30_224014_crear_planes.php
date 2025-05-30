<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('planes', function (Blueprint $table) {
            $table->increments('id');
            $table->string('name', 100);
            $table->decimal('precio', 8, 2)->default(0.00);
            $table->text('descripcion')->nullable();
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('planes');
    }
};
