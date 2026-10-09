<!DOCTYPE html>
<html lang="en" data-theme="{{ in_array(request()->cookie('bb_theme'), ['clay', 'brutal']) ? request()->cookie('bb_theme') : 'clay' }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'BarberBook PH')</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700;800;900&display=swap">
    <link rel="stylesheet" href="{{ asset('css/theme.css') }}">
    <link rel="stylesheet" href="{{ asset('css/app.css') }}">
    @stack('head')
</head>
<body class="@yield('body_class', 'role-c')">
    @yield('body')

    <div id="toasts" aria-live="polite" aria-atomic="false"
         @if (session('toast')) data-flash="{{ session('toast') }}" @endif
         @if (session('toast_error')) data-flash-error="{{ session('toast_error') }}" @endif></div>
    <script src="{{ asset('js/app.js') }}"></script>
    @stack('scripts')
</body>
</html>
