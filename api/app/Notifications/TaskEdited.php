<?php

namespace App\Notifications;

use App\Models\Task;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskEdited extends Notification
{
    use Queueable;

    protected $task;
    protected $user;

    /**
     * Create a new notification instance.
     *
     * @return void
     */
    public function __construct(User $user, Task $task)
    {
        $this->task = $task;
        $this->user = $user;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function via($notifiable)
    {
        return ['broadcast', 'database'];
    }

    /**
     * Get the mail representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        return (new MailMessage())
            ->line('The introduction to the notification.')
            ->action('Notification Action', url('/'))
            ->line('Thank you for using our application!');
    }

    /**
     * Get the array representation of the notification.
     *
     * @param  mixed  $notifiable
     * @return array
     */
    public function toArray($notifiable)
    {
        $jobfair = $this->task->schedule->jobfair;

        return [
            'jobfair' => [
                'id' => $jobfair->id,
                'name' => $jobfair->name,
            ],
            'task' => [
                'id' => $this->task->id,
                'name' => $this->task->name,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
        ];
    }

    public function toBroadcast($notifiable)
    {
        $jobfair = $this->task->schedule->jobfair;

        return new BroadcastMessage([
            'jobfair' => [
                'id' => $jobfair->id,
                'name' => $jobfair->name,
            ],
            'task' => [
                'id' => $this->task->id,
                'name' => $this->task->name,
            ],
            'user' => [
                'id' => $this->user->id,
                'name' => $this->user->name,
            ],
        ]);
    }
}
