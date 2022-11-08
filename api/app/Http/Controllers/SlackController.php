<?php

namespace App\Http\Controllers;

use App\Models\Jobfair;
use App\Services\SlackService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller as BaseController;
use Illuminate\Support\Facades\DB;

class SlackController extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    private const SIGNING_SECRET = 'slack.config.signingSecret';
    protected $slackService;

    public function __construct(SlackService $slackService)
    {
        // $this->middleware('auth');
        $this->slackService = $slackService;
    }

    // TODO : Cần chuyển về slack_id

    public function getTask(Request $request)
    {
        if ($request->has('challenge')) {
            return response()->json($request, 200);
        }

        try {
            $slackSignature = $request->header('X-Slack-Signature');
            $hashedToken = hash_hmac('sha256', 'v0:'.$request->header('X-Slack-Request-Timestamp').':'.$request->getContent(), config(self::SIGNING_SECRET));
            if ($slackSignature !== 'v0='.$hashedToken) {
                return response()->json(['error' => 'Error'], 401);
            }

            $channelID = $request->event['channel'];
            $userSlackID = $request->event['user'];
            $ts = $request->event['ts'];
            // $user = User::where('chatwork_id', $userSlackID)->firstOrFail();
            $jobfair = Jobfair::where('channel_id', $channelID)->firstOrFail();

            $assignTask = DB::table('tasks')->join('assignments', 'tasks.id', '=', 'assignments.task_id')
                ->join('schedules', 'schedules.id', '=', 'tasks.schedule_id')
                ->join('jobfairs', 'jobfairs.id', '=', 'schedules.jobfair_id')
                ->join('users', 'users.id', '=', 'assignments.user_id')
                ->where(['users.chatwork_id' => $userSlackID, 'jobfairs.channel_id' => $channelID])
                ->whereNotIn('tasks.status', ['完了', '中断'])->orderBy('tasks.end_time')
                ->select('tasks.id', 'tasks.name', 'tasks.start_time', 'tasks.end_time', 'tasks.status')->get();

            $reviewTask = DB::table('tasks')->join('task_reviewer', 'tasks.id', '=', 'task_reviewer.task_id')
                ->join('schedules', 'schedules.id', '=', 'tasks.schedule_id')
                ->join('jobfairs', 'jobfairs.id', '=', 'schedules.jobfair_id')
                ->join('users', 'users.id', '=', 'task_reviewer.reviewer_id')
                ->where(['users.chatwork_id' => $userSlackID, 'jobfairs.channel_id' => $channelID])
                ->whereNotIn('tasks.status', ['完了', '中断'])->orderBy('tasks.end_time')
                ->select('tasks.id', 'tasks.name', 'tasks.start_time', 'tasks.end_time', 'tasks.status')->get();

            $jobfairLink = config('app.url').'/jf-toppage/'.$jobfair->id;
            $message = "<@$userSlackID>さん JF <$jobfairLink|$jobfair->name>";
            if ($assignTask->isEmpty() && $reviewTask->isEmpty()) {
                $message .= 'では、タスクはありません。';
            } else {
                $message .= "のタスク一覧です。\n\n";
                if (!$assignTask->isEmpty()) {
                    $message .= "*役割: 担当者*\n";
                    foreach ($assignTask as $task) {
                        $link = config('app.url').'/jobfairs/'.$jobfair->id.'/tasks/'.$task->id;
                        $message .= '<'.$link.'|'.$task->name.'>'."\n";
                        $message .= '>ステータス: '.$task->status."\n";
                        $message .= '>終了日: '.$task->end_time."\n";
                    }
                }

                if (!$reviewTask->isEmpty()) {
                    $message .= "*役割: レビュー*\n";
                    foreach ($reviewTask as $task) {
                        $link = config('app.url').'/jobfairs/'.$jobfair->id.'/tasks/'.$task->id;
                        $message .= '<'.$link.'|'.$task->name.'>'."\n";
                        $message .= '>ステータス: '.$task->status."\n";
                        $message .= '>終了日: '.$task->end_time."\n";
                    }
                }
            }

            $blocks = [
                [
                    'type' => 'section',
                    'text' => [
                        'type' => 'mrkdwn',
                        'text' => $message,
                    ],
                ],
            ];
            $this->slackService->sendMessageThread($blocks, $channelID, $ts);

            return response()->json(['challenge' => 'ok'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 200);
        }
    }
}
