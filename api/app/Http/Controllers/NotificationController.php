<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Models\User;

class NotificationController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
    }

    /**
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        // $arr = str_split($id);
        // foreach ($arr as $char) {
        //     if ($char < '0' || $char > '9') {
        //         return response(['message' => 'invalid id'], 404);
        //     }
        // }

        $user = User::findOrFail($id);

        return $user->notifications;
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function edit($id)
    {
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update($id)
    {
        // $arr = str_split($id);
        // foreach ($arr as $char) {
        //     if ($char < '0' || $char > '9') {
        //         return response(['message' => 'invalid id'], 404);
        //     }
        // }

        $date = Notification::findOrFail($id);
        $date->read_at = \Carbon\Carbon::now();
        $date->save();
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        // return Notification::where('id', $id)->get();
        // return response()->json(['message' => 'Successed']);
        // $arr = str_split($id);
        // foreach ($arr as $char) {
        //     if ($char < '0' || $char > '9') {
        //         return response(['message' => 'invalid id'], 404);
        //     }
        // }

        $noti = Notification::findOrFail($id);
        $noti->delete();

        return response()->json(null);
        // return $noti;
    }

    public function showUnread($id)
    {
        // $arr = str_split($id);
        // foreach ($arr as $char) {
        //     if ($char < '0' || $char > '9') {
        //         return response(['message' => 'invalid id'], 404);
        //     }
        // }

        $user = User::findOrFail($id);

        return $user->unreadNotifications;
    }

    public function updateAllRead($id)
    {
        // $arr = str_split($id);
        // foreach ($arr as $char) {
        //     if ($char < '0' || $char > '9') {
        //         return response(['message' => 'invalid id'], 404);
        //     }
        // }

        $user = User::findOrFail($id);

        foreach ($user->unreadNotifications as $notification) {
            $notification->markAsRead();
        }
    }
}
