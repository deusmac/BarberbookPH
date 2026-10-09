<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('shops', function (Blueprint $t) {
            $t->id();
            $t->string('name');
            $t->string('slug')->unique();
            $t->string('area');
            $t->string('address')->nullable();
            $t->string('open_time', 5)->default('09:00');
            $t->string('close_time', 5)->default('19:00');
            $t->decimal('distance_km', 4, 1)->nullable();
            $t->boolean('is_partner')->default(false);
            $t->boolean('coming_soon')->default(false);
            $t->timestamps();
        });

        Schema::create('services', function (Blueprint $t) {
            $t->id();
            $t->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->decimal('price', 10, 2);
            $t->unsignedSmallInteger('mins');
            $t->boolean('includes_haircut')->default(true); // styles lengthen only services that include a haircut
            $t->boolean('active')->default(true);
            $t->timestamps();
        });

        Schema::create('barbers', function (Blueprint $t) {
            $t->id();
            $t->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('specialty')->nullable();
            $t->unsignedTinyInteger('years')->default(0);
            $t->json('working_days'); // 0=Sun ... 6=Sat
            $t->string('start_time', 5)->default('09:00');
            $t->string('end_time', 5)->default('18:00');
            $t->string('break_at', 5)->nullable(); // one 60 minute break
            $t->boolean('active')->default(true);
            $t->timestamps();
        });

        Schema::create('barber_day_offs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('barber_id')->constrained()->cascadeOnDelete();
            $t->date('date');
            $t->timestamps();
            $t->unique(['barber_id', 'date']);
        });

        Schema::create('styles', function (Blueprint $t) {
            $t->id();
            $t->foreignId('shop_id')->constrained()->cascadeOnDelete();
            $t->string('name');
            $t->string('category', 20); // Fades, Classic, Textured, Kids
            $t->unsignedSmallInteger('mins')->default(30);
            $t->boolean('trending')->default(false);
            $t->boolean('hidden')->default(false);
            $t->string('art', 30)->default('generic');
            $t->timestamps();
        });

        Schema::create('customer_preferences', function (Blueprint $t) {
            $t->id();
            $t->foreignId('user_id')->unique()->constrained()->cascadeOnDelete();
            $t->foreignId('style_id')->nullable()->constrained()->nullOnDelete();
            $t->unsignedTinyInteger('guard')->nullable();
            $t->string('top', 40)->nullable();
            $t->string('beard', 40)->nullable();
            $t->json('extras')->nullable();
            $t->string('notes', 200)->nullable();
            $t->timestamps();
        });

        Schema::create('bookings', function (Blueprint $t) {
            $t->id();
            $t->string('reference', 20)->nullable()->unique();
            $t->foreignId('shop_id')->constrained();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->string('guest_name')->nullable();
            $t->foreignId('barber_id')->constrained();
            $t->foreignId('service_id')->constrained();
            $t->foreignId('style_id')->nullable()->constrained()->nullOnDelete();
            $t->date('date');
            $t->unsignedSmallInteger('start_min'); // minutes after midnight
            $t->unsignedSmallInteger('duration');
            $t->string('status', 12)->default('confirmed'); // pending, confirmed, inchair, done, cancelled, noshow
            $t->boolean('is_walkin')->default(false);
            $t->json('prefs')->nullable(); // guard, top, beard, extras, notes
            $t->string('photo_path')->nullable();
            $t->decimal('price', 10, 2)->default(0);
            $t->string('cancel_reason')->nullable();
            $t->timestamp('reminder_sent_at')->nullable();
            $t->boolean('rated')->default(false);
            $t->timestamps();
            $t->index(['barber_id', 'date']);
            $t->index(['shop_id', 'date']);
            $t->index(['user_id', 'status']);
        });

        Schema::create('feedback', function (Blueprint $t) {
            $t->id();
            $t->foreignId('booking_id')->unique()->constrained()->cascadeOnDelete();
            $t->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $t->foreignId('barber_id')->constrained();
            $t->unsignedTinyInteger('stars');
            $t->json('tags')->nullable();
            $t->string('comment', 500)->nullable();
            $t->timestamps();
        });

        Schema::create('notification_logs', function (Blueprint $t) {
            $t->id();
            $t->foreignId('booking_id')->nullable()->constrained()->nullOnDelete();
            $t->string('channel', 8); // email, sms
            $t->string('kind', 20);   // confirmed, cancelled, rescheduled, reminder
            $t->string('recipient');
            $t->string('subject')->nullable();
            $t->text('body')->nullable();
            $t->string('status', 8); // sent, failed
            $t->string('error')->nullable();
            $t->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['notification_logs', 'feedback', 'bookings', 'customer_preferences', 'styles', 'barber_day_offs', 'barbers', 'services', 'shops'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
