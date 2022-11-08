<?php

namespace App\Http\Controllers;

use App\Http\Requests\CategoryRequest;
use App\Models\Category;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = DB::table('categories')
            ->select('*')
            ->orderBy('categories.updated_at', 'desc')
            ->get();

        return response()->json($data);
    }

    public function getCatgories()
    {
        return Category::all();
    }

    public function search($key)
    {
        return Category::where('category_name', 'LIKE', "%$key%")
            ->orderBy('categories.updated_at', 'desc')
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response
     */
    public function store(CategoryRequest $request)
    {
        // $rules = [
        //     'category_name' => 'required|max:255|unique:categories,category_name|regex:/^[^\s]*$/',
        // ];
        // $validator = Validator::make($request->all(), $rules);
        // $validator->validate();

        return Category::create($request->validated());
    }

    /**
     * Display the specified resource.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Category::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request $request
     * @param  int                      $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $category = Category::find($id);
        if ($category === null) {
            return response()->json([
                'message' => 'Not found',
            ], 404);
        }

        if ($category->name === $request['name']) {
            return $category->update($request->all());
        }

        $rules = [
            'category_name' => 'max:255|unique:categories,category_name|regex:/^[^\s]*$/',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Category::findOrFail($id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Category::findOrFail($id)->delete();
    }

    public function checkDuplicate(Request $request)
    {
        return Category::where('category_name', '=', $request->name)->first();
    }

    public function checkUniqueEdit($id, $name)
    {
        return Category::where('id', '<>', $id)->where('category_name', '=', $name)->get();
    }

    public function getCategoriesWithMember()
    {
        return Category::with('users:id,name')->get();
    }

    public function getMembersByCategory(Request $request)
    {
        if ($request->has('category')) {
            $categoryName = $request->input('category');

            return User::whereHas('categories', function ($query) use ($categoryName) {
                $query->where('category_name', $categoryName);
            })->get();
        }

        return response('Not found', 404);
    }
}
