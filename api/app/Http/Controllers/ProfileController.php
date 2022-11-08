<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProfileController extends Controller
{
    protected $slack;
    private const DEFAULT_AVATAR = '/images/avatars/default.jpg';

    public function __construct(\App\Services\SlackService $slack)
    {
        $this->slack = $slack;
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        return User::all();
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $rules = [
            'id' => 'exists:App\Models\User,id',
        ];
        $validator = Validator::make([
            'id' => $id,
        ], $rules);
        $validator->validate();
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        return User::findOrFail($id);
    }

    public function avatar($id)
    {
        // return Storage::download(Auth::user()->avatar,'avatar');
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $avatar = User::findOrFail($id)->avatar;
        if (!Storage::exists($avatar)) {
            return Storage::download(self::DEFAULT_AVATAR);
        }

        return Storage::download($avatar);

        // return Storage::download($link);
        // return User::find($id)->avatar;
        // return Auth::user();
    }

    public function getAvatar()
    {
        return Storage::download(Auth::user()->avatar, 'avatar');
    }

    public function updateUserInfo(Request $request, $id)
    {
        $rules = [
            'name'  => 'required|string',
            'email' => 'required|email|unique:users,email,'.$id,
            'chatwork_id' => 'required',
        ];

        $validator = Validator::make($request->all(), $rules);
        $validator->validated();
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $userSlackId = User::where('chatwork_id', '=', $request->chatwork_id)->first();
        $user = User::findOrFail($id);
        if ($userSlackId !== null) {
            if ($userSlackId->chatwork_id !== $user->chatwork_id) {
                return response()->json(['message' => 'Slack IDは別のアカウントに利用されています。'], 422);
            }
        }

        $response = $this->slack->checkInWorkspace($request->chatwork_id);
        $res = json_decode($response);
        if ($res->ok === false) {
            return response()->json(['message' => 'ワークスペースにユーザーが見つかりません。 スラックIDを確認してください'], 422);
        }

        $user->update($request->all());

        return response()->json(['message' => 'Updated successfully'], 200);
    }

    public function updatePassword(Request $request, $id)
    {
        $request->validate([
            'current_password' => 'required|string',
            'password'         => 'required|string|min:8|max:24',
            'comfirm_password' => 'required|string|same:password',
        ]);
        $arr = str_split($id);
        foreach ($arr as $char) {
            if ($char < '0' || $char > '9') {
                return response(['message' => 'invalid id'], 404);
            }
        }

        $user = User::findOrFail($id);
        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json(['message' => 'Current password incorrect']);
        }

        $user->update([
            'password' => bcrypt($request->password),
        ]);

        return response()->json(['message' => 'Password has been successfully changed']);
    }

    public function updateAvatar(Request $request, $id)
    {
        if ($request->hasFile('avatar')) {
            $arr = str_split($id);
            foreach ($arr as $char) {
                if ($char < '0' || $char > '9') {
                    return response(['message' => 'invalid id'], 404);
                }
            }

            $user = User::findOrFail($id);

            $rules = [
                'avatar' => 'required|mimes:jpg,png|max:4096',
            ];

            $validator = Validator::make($request->all(), $rules);
            $validator->validated();

            $avatar = $user->id.'.'.$request->avatar->extension();
            $request->file('avatar')->storeAs('public/images/avatars', $avatar);

            $path = "public/images/avatars/$avatar";
            $request->avatar = $path;
            $user['avatar'] = $path;
            $user->update();

            return response()->json($path);
        }

        return response()->json(['message' => 'Failed']);
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

        return User::findOrFail($id)->delete();
    }
}
