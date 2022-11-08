<?php

namespace App\Console\Commands;

use App\Models\Jobfair;
use App\Models\Task;
use App\Models\User;
use App\Services\SlackService;
use Carbon\Carbon;
use Illuminate\Console\Command;

class SlackTask extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'task:slack';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This will update status task';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    protected $slack;

    public function __construct(SlackService $slack)
    {
        parent::__construct();
        $this->slack = $slack;
    }

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        $url = config('app.url');
        $tasksEnd = Task::whereIn('status', ['未着手', '進行中'])->whereNull('parent_id')
            ->whereDate('end_time', '=', now()->toDateString())->get();

        $text = '';
        foreach ($tasksEnd as $task) {
            $adminIds = $task->schedule->jobfair->admins->pluck('id')->toArray();
            $jobfairId = $task->schedule->jobfair->id;
            $channelId = Jobfair::where('id', '=', $jobfairId)->get(['channel_id']);
            if ($task->is_parent === 0) {
                $userId = $task->users->pluck('id')->toArray();
                foreach ($adminIds as $adminId) {
                    $text .= "{$this->mentionUser($userId, $adminId)}";
                }

                $text .= "\n期限が今日までのタスクがあります\nタスク： <{$url}/jobfairs/${jobfairId}/tasks/{$task->id}|{$task->name}>\n確認してください";
            } else {
                $userId = [];
                $children = Task::where('parent_id', '=', $task->id)->get();
                foreach ($children as $child) {
                    $userId = array_merge($userId, $child->users->pluck('id')->toArray());
                }

                foreach ($adminIds as $adminId) {
                    $text .= "{$this->mentionUser(array_unique($userId), $adminId)}";
                }

                $text .= "\n期限が今日までのタスクがあります\nタスク： <{$url}/jobfairs/${jobfairId}/tasks/{$task->id}|{$task->name}>\n確認してください";
            }

            $this->slack->dailyBot($text, $channelId[0]->channel_id);
        }

        $tasksStart = Task::whereIn('status', ['未着手', '進行中'])->whereNull('parent_id')
            ->whereDate('start_time', '=', now()->toDateString())->get();
        foreach ($tasksStart as $task) {
            $adminIds = $task->schedule->jobfair->admins->pluck('id')->toArray();
            $jobfairId = $task->schedule->jobfair->id;
            $channelId = Jobfair::where('id', '=', $jobfairId)->get(['channel_id']);
            if ($task->is_parent === 0) {
                $userId = $task->users->pluck('id')->toArray();
                foreach ($adminIds as $adminId) {
                    $text .= "{$this->mentionUser($userId, $adminId)}";
                }

                $text .= "\n今日始めるタスクがあります\nタスク： <{$url}/jobfairs/${jobfairId}/tasks/{$task->id}|{$task->name}>\n確認してください";
            } else {
                $userId = [];
                $children = Task::where('parent_id', '=', $task->id)->get();
                foreach ($children as $child) {
                    $userId = array_merge($userId, $child->users->pluck('id')->toArray());
                }

                foreach ($adminIds as $adminId) {
                    $text .= "{$this->mentionUser(array_unique($userId), $adminId)}";
                }

                $text .= "\n今日始めるタスクがあります\nタスク： <{$url}/jobfairs/${jobfairId}/tasks/{$task->id}|{$task->name}>\n確認してください";
            }

            $this->slack->dailyBot($text, $channelId[0]->channel_id);
        }

        $tasksOver = Task::whereIn('status', ['未完了'])->whereNull('parent_id')
            ->whereDate('end_time', '=', Carbon::yesterday()->toDateString())->get();
        foreach ($tasksOver as $task) {
            $jobfairId = $task->schedule->jobfair->id;
            $channelId = Jobfair::where('id', '=', $jobfairId)->get(['channel_id']);
            $adminIds = $task->schedule->jobfair->admins->pluck('id')->toArray();
            foreach ($adminIds as $adminId) {
                $slackId = User::where('id', '=', $adminId)->get(['chatwork_id']);
                $text .= "<@{$slackId[0]->chatwork_id}>さん、";
            }

            $text .= "\n期限が過ぎているタスクがあります\nタスク： <{$url}/jobfairs/${jobfairId}/tasks/{$task->id}|{$task->name}>\n確認してください";
            $this->slack->dailyBot($text, $channelId[0]->channel_id);
        }
    }

    private function mentionUser($userId, $adminId)
    {
        $slackId = [];
        $emptySlackId = [];
        $userList = User::whereIn('id', $userId)->get(['chatwork_id', 'name'])->toArray();
        foreach ($userList as $user) {
            if (isset($user['chatwork_id'])) {
                $slackId[] = $user['chatwork_id'];
            } else {
                $emptySlackId[] = $user['name'].'さん';
            }
        }

        $mention = '';
        if (count($slackId) > 0) {
            $listUserId = implode('>さん、<@', $slackId);
            $mention = "<@{$listUserId}>さん";
        }

        if (count($emptySlackId) > 0) {
            if (count($slackId) > 0) {
                $mention .= '、';
            }

            $mention .= implode('、', $emptySlackId);
        }

        if (count($slackId) === 0 && count($emptySlackId) === 0) {
            $slackId = User::where('id', '=', $adminId)->get(['chatwork_id']);
            $mention = "<@{$slackId[0]->chatwork_id}>さん　(*まだ、担当者をアサインしていません*)";
        }

        return $mention;
    }
}
