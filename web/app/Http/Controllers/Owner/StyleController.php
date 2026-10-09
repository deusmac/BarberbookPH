<?php

namespace App\Http\Controllers\Owner;

use App\Models\Style;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StyleController extends OwnerController
{
    public const ARTS = ['midtaper', 'lowfade', 'highfade', 'twoblock', 'fringe', 'frenchcrop', 'buzz', 'crew', 'sidepart', 'pompadour', 'mullet', 'kids', 'generic'];

    public function index()
    {
        return view('owner.styles', ['styles' => $this->shop()->styles()->orderBy('category')->orderBy('name')->get(), 'arts' => self::ARTS, 'cats' => Style::CATEGORIES]);
    }

    public function store(Request $request)
    {
        $d = $request->validate($this->rules() + ['art' => ['required', Rule::in(self::ARTS)]]);
        $this->shop()->styles()->create($d);

        return redirect()->route('owner.styles')->with('toast', 'Style added.');
    }

    public function update(Request $request, Style $style)
    {
        $this->own($style);
        $style->update($request->validate($this->rules()));

        return redirect()->route('owner.styles')->with('toast', 'Style updated.');
    }

    public function toggle(Request $request, Style $style)
    {
        $this->own($style);
        $field = $request->validate(['field' => ['required', 'in:trending,hidden']])['field'];
        $style->update([$field => ! $style->{$field}]);

        return back()->with('toast', $field === 'hidden' ? ($style->hidden ? $style->name.' hidden from customers.' : $style->name.' is visible again.') : ($style->trending ? $style->name.' marked trending.' : 'Trending removed.'));
    }

    private function rules(): array
    {
        return ['name' => ['required', 'string', 'max:80'], 'mins' => ['required', 'integer', 'between:5,180'], 'category' => ['required', Rule::in(Style::CATEGORIES)]];
    }
}
