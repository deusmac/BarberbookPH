<?php

namespace App\Http\Controllers\Owner;

use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends OwnerController
{
    public function index()
    {
        return view('owner.services', ['services' => $this->shop()->services()->orderBy('id')->get()]);
    }

    public function store(Request $request)
    {
        $this->shop()->services()->create($this->data($request, true));

        return redirect()->route('owner.services')->with('toast', 'Service added.');
    }

    /** Services are hidden (active=false), never deleted, so past bookings keep their service. */
    public function update(Request $request, Service $service)
    {
        $this->own($service);
        $service->update($this->data($request, false));

        return redirect()->route('owner.services')->with('toast', 'Service updated.');
    }

    private function data(Request $request, bool $creating): array
    {
        $d = $request->validate([
            'name' => ['required', 'string', 'max:80'],
            'price' => ['required', 'numeric', 'between:0,100000'],
            'mins' => ['required', 'integer', 'between:5,240'],
        ]);

        return [
            'name' => trim($d['name']), 'price' => $d['price'], 'mins' => (int) $d['mins'],
            'includes_haircut' => $request->boolean('includes_haircut'),
            'active' => $creating ? true : $request->boolean('active'),
        ];
    }
}
