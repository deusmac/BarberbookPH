<?php

namespace App\Http\Controllers;

use App\Models\Shop;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
    public function landing()
    {
        if ($u = Auth::user()) {
            return redirect($u->isOwner() ? route('owner.queue') : route('customer.home'));
        }

        return view('auth.landing', ['shop' => Shop::where('is_partner', true)->first()]);
    }

    public function showLogin() { return view('auth.login'); }

    public function login(Request $request)
    {
        $cred = $request->validate(['email' => 'required|email', 'password' => 'required|string']);
        if (! Auth::attempt($cred, $request->boolean('remember'))) {
            return back()->withErrors(['email' => 'That email and password do not match.'])->onlyInput('email');
        }
        $request->session()->regenerate();
        $user = Auth::user();

        return redirect()->intended($user->isOwner() ? route('owner.queue') : route('customer.home'));
    }

    public function showRegister() { return view('auth.register'); }

    public function register(Request $request)
    {
        $request->merge(['mobile' => preg_replace('/[^\d+]/', '', (string) $request->input('mobile'))]);
        $data = $request->validate([
            'name' => 'required|string|max:80',
            'email' => 'required|email|max:120|unique:users,email',
            'mobile' => ['required', 'regex:/^(\+?63|0)9\d{9}$/'],
            'password' => ['required', 'confirmed', Password::min(8)],
            'privacy' => 'accepted',
        ], [
            'mobile.regex' => 'Enter a Philippine mobile number like 0917 123 4567.',
            'privacy.accepted' => 'Please accept the data privacy notice to continue.',
        ]);
        $user = User::create([
            'name' => $data['name'], 'email' => $data['email'], 'password' => $data['password'],
            'mobile' => preg_replace('/\D+/', '', $data['mobile']), 'role' => 'customer',
        ]);
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->route('customer.home')->with('toast', 'Welcome to BarberBook PH, '.$user->name.'!');
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/');
    }
}
