<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class ResetPasswordController extends BaseController
{
    public function handleRequest(Request $request)
    {
        $request->validate(['email' => 'required|email']);
        $user = User::whereEmail($request->email)->first();
        if ($user) {
            DB::table('password_resets')->insert([
                'email'      => $request->email,
                'token'      => Str::random(60),
                'created_at' => now(),
            ]);
            $token = DB::table('password_resets')->where('email', $request->email)->first()->token;
            $data = ['user' => $user, 'token' => $token];

            $this->sendEmail($user, $data);

            return response()->json(['message' => 'Email sent', 'token' => $token], 200);
        }

        return response()->json(['message' => 'Email does not exist'], 400);
    }

    private function sendEmail($user, $data)
    {
        /**
         * Send email with html view
         *
         * @param resource/views/email/reset 'email.reset': html view of email body
         * @param $data : variables which used in view
         * @return \Illuminate\Http\Response
         */
        Mail::send('email.reset', $data, function ($message) use ($user) {
            $message->to($user->email);
            $message->subject('Reset your password');
        });
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'token'    => 'required|string',
            'password' => 'required|string|min:8|max:24',
        ]);
        $email = DB::table('password_resets')
            ->where('token', $request->token)
            ->value('email');

        $user = User::where('email', $email)->first();
        $user->password = Hash::make($request->password);
        $user->update();
        DB::table('password_resets')
            ->where('email', $user->email)
            ->delete();

        return response()->json(['message' => 'Password has been successfully changed']);
    }
}
