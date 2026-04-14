<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class PropertyController extends Controller
{
    /**
     * 🟢 ADMIN - LIST (INERTIA)
     */
    public function index()
    {

    $properties = Property::where('active', true)
        ->orderBy('id', 'desc')
        ->get()
        ->map(function ($p) {
            return [
                'id' => $p->id,
                'blockchain_id' => $p->blockchain_id,
                'title' => $p->title,
                'description' => $p->description,
                'price' => $p->price,
                'image' => Storage::url($p->image),
                'active' => $p->active,
            ];
        });

        return Inertia::render('Admin', [
            'properties' => $properties,
        ]);
    }

    /**
     * 🟢 PUBLIC PAGE (INERTIA)
     */
    public function showPage($id)
    {
        return Inertia::render('Property', [
            'id' => $id
        ]);
    }

    /**
     * 🟢 CREATE
     */
    public function store(Request $request)
    {
        \Log::info('Request files:', ['files' => $request->allFiles()]);
        \Log::info('Request all:', ['data' => $request->except('image')]);

        $validated = $request->validate([
            'blockchain_id' => 'required|integer|unique:properties,blockchain_id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'required|image|max:2048',
        ]);

        $imagePath = $request->file('image')->store('properties', 'public');
        \Log::info('imagePath:', ['path' => $imagePath]);

        Property::create([
            'blockchain_id' => $validated['blockchain_id'],
            'title' => $validated['title'],
            'description' => $validated['description'],
            'price' => $validated['price'],
            'image' => $imagePath,
            'active' => true,
        ]);

        return redirect()->route('properties.index')->with('success', 'Property created');
    }

    /**
     * 🟡 UPDATE
     */
    public function update(Request $request, $id)
    {
        $property = Property::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        if ($request->hasFile('image')) {
            if ($property->image) {
                Storage::disk('public')->delete($property->image);
            }

            $validated['image'] = $request->file('image')->store('properties', 'public');
        }

        $property->update($validated);

        return redirect()->back()->with('success', 'Property updated');
    }

    /**
     * 🔴 DELETE (RECOMMENDED: soft logical delete)
     */
    public function destroy($id)
    {
        $property = Property::findOrFail($id);

        // 👉 Better than hard delete:
        $property->update([
            'active' => false
        ]);

        return redirect()->back()->with('success', 'Property deactivated');
    }

    /**
     * 🔵 API LIST (for Web3 properties)
     */
    public function apiIndex()
    {
        return response()->json(
            Property::where('active', true)
                ->orderBy('id', 'desc')
                ->get()
                ->map(function ($p) {
                    return [
                        'id' => $p->id,
                        'blockchain_id' => $p->blockchain_id,
                        'title' => $p->title,
                        'description' => $p->description,
                        'price' => $p->price,
                        'image' => Storage::url($p->image),
                    ];
                })
        );
    }

    /**
     * 🔵 API SHOW (single metadata)
     */
    public function apiShow($blockchainId)
    {
        $property = Property::where('blockchain_id', $blockchainId)
            ->where('active', true)
            ->first();

        if (!$property) {
            return response()->json(null);
        }
        
        return response()->json([
            'title' => $property->title,
            'description' => $property->description,
            'price' => $property->price,
            'image' => Storage::url($property->image),
        ]);

    }
}
