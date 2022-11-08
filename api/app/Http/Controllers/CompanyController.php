<?php

namespace App\Http\Controllers;

use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class CompanyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $data = DB::table('companies')
            ->select('*')
            ->orderBy('companies.updated_at', 'desc')
            ->get();

        return response()->json($data);
    }

    public function search($key)
    {
        return Company::where('company_name', 'LIKE', "%$key%")
            ->orderBy('companies.updated_at', 'desc')
            ->get();
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $rules = [
            'company_name'    => 'required|unique:companies,company_name|min:0|max:100',
        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();

        return Company::create($request->all());
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
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

        return Company::findOrFail($id);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $rules = [
            'company_name'    => ['required', 'min:0', 'max:100',  Rule::unique('companies')->whereNot('id', $id) ],

        ];
        $validator = Validator::make($request->all(), $rules);
        $validator->validate();
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return Company::findOrFail($id)->update($request->all());
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
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

        return Company::findOrFail($id)->delete();
    }

    public function checkUniqueEdit(Request $request)
    {
        return Company::where('id', '<>', $request->id)->where('company_name', '=', $request->name)->first();
    }

    public function checkDuplicate(Request $request)
    {
        return Company::where('company_name', '=', $request->name)->first();
    }
}
