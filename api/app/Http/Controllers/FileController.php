<?php

namespace App\Http\Controllers;

use App\Models\Document;
use App\Models\Jobfair;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class FileController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index($jfId)
    {
        $arr = str_split($jfId);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        Jobfair::findOrFail($jfId);
        $files = DB::table('documents')
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('path', '/')
            ->where('document_id', $jfId)
            ->orderBy('documents.is_file', 'asc')
            ->orderBy('documents.updated_at', 'desc')
            ->get();

        return response()->json($files);
    }

    public function getLatest($id)
    {
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        Jobfair::findOrFail($id);

        return DB::table('documents')
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('is_file', true)
            ->where('document_id', $id)
            ->orderBy('documents.updated_at', 'desc')
            ->take(10)
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
        $arr = str_split($request->document_id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        Jobfair::findOrFail($request->document_id);
        $rules = [
            'name' => [
                'required',
                Rule::unique('documents')->where('path', $request->path)->where('document_id', $request->document_id)->where('is_file', $request->is_file),
            ],
        ];
        if ($request->is_file) {
            $rules['link'] = 'required';
        }

        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->messages(), 200);
        }

        Document::create(array_merge(
            $request->all(),
            ['authorId' => auth()->user()->id],
            ['updaterId' => auth()->user()->id],
            ['document_type' => 'App\Models\Jobfair']
        ));

        return DB::table('documents')
            ->join('users', 'users.id', '=', 'documents.updaterId')
            ->select('users.name as updaterName', 'documents.*')
            ->where('path', $request->path)
            ->where('document_id', $request->document_id)
            ->orderBy('documents.is_file', 'asc')
            ->orderBy('documents.updated_at', 'desc')
            ->get();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $pervious folder id
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

        return Document::findOrFail($id);
    }

    //  Display files and folder in specific folder.
    public function getPath(Request $request)
    {
        $arr = str_split($request->jfId);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        Jobfair::findOrFail($request->jfId);
        $data = DB::table('documents')
            ->select('*')
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('path', $request->path)
            ->where('document_id', $request->jfId)
            ->orderBy('is_file', 'asc')
            ->orderBy('updated_at', 'desc')
            ->get();

        return response()->json($data);
    }

    public function search(Request $request)
    {
        // $arr = str_split($request->jfId);
        // foreach ($arr as $char) {
        //     if ($char < '0' || $char > '9') {
        //         return response(['message' => 'invalid id'], 404);
        //     }
        // }

        // Jobfair::findOrFail($request->jfId);
        $query = Document::query();
        if ($request->has('name')) {
            $query->where('name', 'LIKE', "%$request->name%");
        }

        if ($request->has('start_date')) {
            $query->where('updated_at', '>=', $request->start_date);
        }

        if ($request->has('end_date')) {
            $query->where('updated_at', '<=', $request->end_date);
        }

        if ($request->has('updaterId')) {
            $query->where('updaterId', $request->updaterId);
        }

        return $query->where('is_file', true)->where('document_id', $request->jfID)->addSelect([
            'authorName' => User::select('name')
                ->whereColumn('id', 'documents.authorId'),
        ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->orderBy('documents.updated_at', 'desc')->get();
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
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $document = Document::findOrFail($id);
        $rules = [
            'name' => Rule::unique('documents')->where('path', $document->path)
                ->where('document_id', $document->document_id)
                ->where('is_file', $document->is_file)
                ->whereNot('id', $id),
        ];
        $validator = Validator::make($request->all(), $rules);
        if ($validator->fails()) {
            return response()->json($validator->messages(), 200);
        }

        $document->update(array_merge($request->all(), ['updaterId' => auth()->user()->id]));

        return DB::table('documents')
            ->select('*')
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->where('path', $document->path)
            ->where('document_id', $document->document_id)
            ->orderBy('documents.is_file', 'asc')
            ->orderBy('documents.updated_at', 'desc')
            ->get();
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

        return Document::findOrFail($id)->delete();
    }

    public function destroyArrayOfDocument(Request $request, $id)
    {
        $path = Document::where('id', $request->id[0])->first()->path;
        foreach ($request->id as $index) {
            $arr = str_split($index);
            foreach ($arr as $char) {
                if ($char < '0' || $char > '9') {
                    return response(['message' => 'invalid id'], 404);
                }
            }

            $document = Document::findOrFail($index);
            if (!$document->is_file) {
                if ($path === '/') {
                    $pathD = $path.$document->name;
                } else {
                    $pathD = $path.'/';
                    $pathD .= $document->name;
                }

                $term = $pathD.'/';
                $term .= '%';
                $result = Document::where('path', 'LIKE', $term)->orWhere('path', $pathD);

                $jobfair = Jobfair::findOrFail($id);

                $adminJFs = [];
                foreach ($jobfair->admins as $admin) {
                    array_push($adminJFs, $admin->id);
                }

                if ($result->where('authorId', '<>', auth()->user()->id)->count() > 0 && !in_array(auth()->user()->id, $adminJFs)) {
                    return response(['message' => 'Subfolder and Subfile can not be deleted '], 400);
                }

                $result->delete();
            }

            Document::destroy($index);
        }

        return Document::select('*')
            ->where('path', $path)
            ->where('document_id', $id)
            ->addSelect([
                'authorName' => User::select('name')
                    ->whereColumn('id', 'documents.authorId'),
            ])
            ->addSelect([
                'updaterName' => User::select('name')
                    ->whereColumn('id', 'documents.updaterId'),
            ])
            ->orderBy('is_file', 'asc')
            ->orderBy('updated_at', 'desc')
            ->get();
    }

    public function getMember()
    {
        return User::all();
    }
}
