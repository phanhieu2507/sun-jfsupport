<?php

use Illuminate\Support\Str;

return [
    'api' => [
        'createChannel' => 'https://slack.com/api/conversations.create',
        'addUserToChannel' => 'https://slack.com/api/conversations.invite',
        'sendMessage' => 'https://slack.com/api/chat.postMessage',
        'checkUser' => 'https://slack.com/api/users.conversations',
        'changeChannelName' => 'https://slack.com/api/conversations.rename',
        'createBookmark' => 'https://slack.com/api/bookmarks.add',
        'getUserInfo' => 'https://slack.com/api/users.info',
        'pinsMessage' => 'https://slack.com/api/pins.add',
        'getChannelInfo' => 'https://slack.com/api/conversations.info',
    ],
    'config' => [
        'botId' => env('BOT_ID', ''),
        'signingSecret' => env('SIGNING_SECRET', ''),
        'slack_token' => env('SLACK_TOKEN', ''),
        'workspace_id' => env('WORKSPACE', ''),
        'superAdminID' => env('SUPER_ADMIN_ID', Str::random(11)),
    ],
    'messages' => [
        'errors' => [
            'channelExists' => 'channel_exists',
        ],
    ],
];
