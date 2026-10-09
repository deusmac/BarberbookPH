# Running and deploying BarberBook PH

## Local (SQLite, no setup)
```
cd web
cp .env.example .env
composer install
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan storage:link
php artisan serve
```
Open http://localhost:8000. The owner account comes from `OWNER_EMAIL` / `OWNER_PASSWORD` in `.env` (change them first). Optional demo data: `php artisan db:seed --class=DemoSeeder` (demo customer `juan@example.com` / `password`; local use only).
Tests: `php artisan test`.

## Production checklist
1. **Server**: PHP 8.3+, MySQL 8 (or MariaDB 10.6+), a web server pointing at `web/public`. Shared hosting with PHP 8.3 works.
2. **Environment** (`web/.env`): `APP_ENV=production`, `APP_DEBUG=false`, `APP_URL=https://your-domain`, `APP_TIMEZONE=Asia/Manila`.
3. **MySQL**: set `DB_CONNECTION=mysql`, `DB_HOST`, `DB_PORT`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`, then `php artisan migrate --force` and `php artisan db:seed --force` once.
4. **Email (Gmail SMTP)**: turn on 2-step verification on the Gmail account, create an App Password, then set `MAIL_MAILER=smtp`, `MAIL_HOST=smtp.gmail.com`, `MAIL_PORT=587`, `MAIL_USERNAME=<gmail address>`, `MAIL_PASSWORD=<app password>`, `MAIL_ENCRYPTION=tls`, `MAIL_FROM_ADDRESS=<gmail address>`.
5. **SMS**: create a Semaphore account (semaphore.co), then `SMS_DRIVER=semaphore`, `SEMAPHORE_API_KEY=...`, `SEMAPHORE_SENDER_NAME=BarberBook`. Leave `SMS_DRIVER=log` to write texts to `storage/logs` instead. A different gateway only needs a class implementing `App\Contracts\SmsGateway`.
6. **Reminders**: add one cron line so the scheduler runs every minute (it sends the 1 hour reminders):
   `* * * * * cd /path/to/web && php artisan schedule:run >> /dev/null 2>&1`
7. **Files**: `php artisan storage:link`; make `storage/` and `bootstrap/cache/` writable by the web user.
8. **Optimize**: `composer install --no-dev --optimize-autoloader`, then `php artisan config:cache route:cache view:cache`.
9. **HTTPS** is required (sessions and passwords). Set `SESSION_SECURE_COOKIE=true`.
10. **Backups**: schedule a nightly database dump and keep `storage/app/public/references` backed up.
11. **Change the seeded owner password** after first login and never commit `.env`.

## Data privacy (RA 10173)
Customers consent at sign up. Details are used only for their bookings and notifications. Do not export or share customer data outside the shop. Add the school or shop's privacy contact to the footer before going live.

## Known limits (by design, from the thesis scope)
No online payment (pay at the shop), no AI or AR hairstyle preview, no native mobile app (the site is mobile-first and works in any phone browser).
