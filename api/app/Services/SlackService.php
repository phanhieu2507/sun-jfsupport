<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;

class SlackService
{
    private const RES_OK_DEFAULT = [
        'ok' => true,
    ];
    protected $slacktoken;
    protected $workspace;
    protected $client;
    protected $botID;
    protected $slackDevMode;

    public function __construct()
    {
        $this->slacktoken = config('slack.config.slack_token');
        $this->workspace = config('slack.config.workspace_id');
        $this->client = Http::withToken($this->slacktoken);
        $this->botID = config('slack.config.botId');

        // Dev mode
        $this->slackDevMode = config('app.env') !== 'production';
    }

    public function createChannel($name)
    {
        $name = str_replace([' ', '　'], '_', $name);
        $res = [
            'ok' => true,
            'channel' => [
                'id' => Str::random(11),
                'name' => $name,
            ],
        ];

        try {
            return $this->slackDevMode ? json_encode($res) : $this->client->post(config('slack.api.createChannel'), [
                'name' => $name,
                'is_private' => 'true',
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function addUserToChannel($channelId, $listSlackId)
    {
        try {
            return $this->slackDevMode ? json_encode(self::RES_OK_DEFAULT) : $this->client->post(config('slack.api.addUserToChannel'), [
                'channel' => $channelId,
                'users' => $listSlackId,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function addSuperAdminToChannel($channelId)
    {
        $superAdmin = User::where('role', 1)->first();

        return $this->addUserToChannel($channelId, $superAdmin->chatwork_id);
    }

    public function addAdminToChannel($dataAdminToChannel)
    {
        try {
            return $this->slackDevMode ? json_encode(self::RES_OK_DEFAULT) : $this->client->post(config('slack.api.addUserToChannel'), [
                'channel' => $dataAdminToChannel[0],
                'users' => $dataAdminToChannel[1],
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function sendMessageThread($blocks, $channelId, $ts)
    {
        return $this->slackDevMode ? json_encode(self::RES_OK_DEFAULT) : $this->client->post(config('slack.api.sendMessage'), [
            'channel' => $channelId,
            'as_user' => $this->botID,
            'blocks' => $blocks,
            'thread_ts' => $ts,

        ]);
    }

    public function createChannelBot($jfName, $channelId, $jbId)
    {
        try {
            if ($this->slackDevMode) {
                return json_encode(self::RES_OK_DEFAULT);
            }

            $link = config('app.url').'/jobfairs/'.$jbId.'/jf-toppage';
            $res = $this->client->post(config('slack.api.sendMessage'), [
                'channel' => $channelId,
                'text' => "こちらはJobfair {$jfName} の情報交換を行うためのチャンネルです。\nJFSupport上のリンク: $link",
            ]);
            $re = json_decode($res);
            if (isset($re->ts)) {
                $this->client->post(config('slack.api.pinsMessage'), [
                    'channel' => $channelId,
                    'timestamp' => $re->ts,
                ]);
            }
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function dailyBot($text, $channelId)
    {
        try {
            return $this->slackDevMode ? json_encode(self::RES_OK_DEFAULT) : $this->client->post(config('slack.api.sendMessage'), [
                'channel' => $channelId,
                'as_user' => $this->botID,
                'text' => $text,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function checkInWorkspace($userId)
    {
        $res = strlen($userId) === 11 ? [
            'ok' => true,
            'user' => [
                'id' => $userId,
            ],
        ] : [
            'ok' => false,
            'error' => 'user_not_found',
        ];
        try {
            return $this->slackDevMode ? json_encode($res) : $this->client->get(config('slack.api.getUserInfo'), [
                'user' => $userId,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function getInfoChannel($channelId)
    {
        $res = [
            'ok' => true,
            'channel' => [
                'id' => $channelId,
                'name' => Str::random(10),
            ],
        ];
        try {
            return $this->slackDevMode ? json_encode($res) : $this->client->get(config('slack.api.getChannelInfo'), [
                'channel' => $channelId,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }

    public function changeNameChannel($channelId, $name)
    {
        try {
            return $this->slackDevMode ? json_encode(self::RES_OK_DEFAULT) : $this->client->post(config('slack.api.changeChannelName'), [
                'channel' => $channelId,
                'name' => $name,
            ]);
        } catch (\Throwable $th) {
            return response()->json(['message' => $th], 400);
        }
    }
}
