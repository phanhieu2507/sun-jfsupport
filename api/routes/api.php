<?php

use App\Http\Controllers\MemberController;
use App\Http\Controllers\MemberDetailController;
use App\Http\Controllers\StatusController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\TopPageTasksController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
 */

Route::get('/web-init', WebInit::class);

Route::post('/user_tasks', 'SlackController@getTask');

// jobfair
Route::resource('/jobfair', 'JobfairController')->except([
    'store',
    'update',
    'destroy',
]);
Route::resource('/milestone', MilestoneController::class)->only(['index']);
Route::apiResource('/category', CategoryController::class)->only(['index']);

Route::group(['prefix' => 'jobfair/{id}'], function () {
    Route::get('/milestones', 'JobfairController@getMilestones');
    Route::get('/tasks', 'JobfairController@getTasks');
    Route::get('/tasks-with-parent', 'JobfairController@getTasksWithParent');
    Route::get('/updated-tasks', 'JobfairController@updatedTasks');
    Route::get('/tasks/search', 'JobfairController@searchTask');
    Route::post('/add-task', 'TaskController@store');
    Route::get('/get-template-task-not-add', 'TaskController@getTemplateTaskNotAdd');
    Route::get('/gantt', 'JobfairController@ganttChart');
});

Route::get('/jf-schedule/{id}', 'ScheduleController@getSchedule');
Route::get('/milestone/search', 'MilestoneController@getSearch');
Route::post('/is-jf-existed', 'JobfairController@checkNameExisted');
Route::get('/is-admin-jobfair', 'JobfairController@isAdminJobfair');

// schedule

Route::resource('/schedules', 'ScheduleController')->except([
    'store',
    'update',
    'destroy',
]);
Route::get('jf-schedules/all-milestones', 'ScheduleController@getAllMilestones');
Route::get('jf-schedules/all-template-tasks', 'ScheduleController@getAllTemplateTasks');
Route::post('jf-schedules/checkScheduleNameExist', 'ScheduleController@checkScheduleNameExist');
Route::prefix('schedules/{id}')->group(function () {
    Route::get('/added-milestones', 'ScheduleController@getAddedMilestones');
    Route::get('/added-template-tasks', 'ScheduleController@getAddedTemplateTasks');
    Route::get('/parent-and-child-tasks', 'ScheduleController@getListTemplateTasks');
});
Route::get('/schedules/{id}/milestones', 'ScheduleController@getMilestones');
Route::get('/schedules/{id}/template-tasks', 'ScheduleController@getTemplateTasks');
Route::prefix('schedule')->group(function () {
    Route::get('/', 'ScheduleController@getAll');
    Route::get('/search', 'ScheduleController@search');
    Route::get('/{id}/list', 'ScheduleController@getList');
    Route::get('/{id}/gantt', 'ScheduleController@getGanttChart');
});

Route::delete('/schedules/{id}', 'ScheduleController@destroy');

Route::get('/admins', 'AdminController@index');

//milestone

Route::get('/milestone/search', 'MilestoneController@getSearch');
//milestone controller
Route::get('/milestones/{id}/list', 'MilestoneController@getInfoMilestones');
Route::post('/milestone/check-name-existed', 'MilestoneController@checkMilestoneNameExisted');
//member

Route::prefix('member')->group(function () {
    Route::get('/', 'MemberController@index');
    Route::get('/{id}', 'MemberController@showMember');
    Route::patch('/{id}/update', 'MemberController@update');
    Route::get('/{id}/tasks', 'MemberController@getTaskByID');
});

// login, logout

Route::post('/login', 'AuthController@login');
Route::get('/preURL', 'AuthController@preURL');
Route::get('/getPreURL', 'AuthController@getPreURL');
Route::post('/logout', 'AuthController@logout');
Route::post('/reset-password', 'ResetPasswordController@handleRequest');
Route::post('/update-password', 'ResetPasswordController@updatePassword');

//template-task
Route::resource('/template-tasks', 'TemplateTaskController')->except([
    'store',
    'update',
    'destroy',
]);
Route::get('/template-task-not-added/{id}', 'TemplateTaskController@getTemplateTaskNotAdded');
Route::get('/categories-template-tasks', 'TemplateTaskController@getCategoriesTasks');
Route::get('/before-template-tasks/{id}', 'TemplateTaskController@getBeforeTasks');
Route::get('/after-template-tasks/{id}', 'TemplateTaskController@getAfterTasks');
Route::post('/is-template-task-existed', 'TemplateTaskController@checkNameExisted');
Route::get('/list-before-and-after-template-tasks/{id}', 'TemplateTaskController@getListBeforeAndAfterTemplateTask');
//category
Route::get('/category/find/{key}', [\App\Http\Controllers\CategoryController::class, 'search']);
Route::post('/category/check-duplicate', [\App\Http\Controllers\CategoryController::class, 'checkDuplicate']);
Route::get('/category/check-unique-edit/{id}/{name}', [\App\Http\Controllers\CategoryController::class, 'checkUniqueEdit']);
Route::get('/category-jobfair', [\App\Http\Controllers\CategoryController::class, 'getCategoriesWithMember']);
Route::get('/category-member', [\App\Http\Controllers\CategoryController::class, 'getMembersByCategory']);
Route::prefix('categories')->group(function () {
    Route::get('/', 'CategoryController@getCatgories');
});
//company
Route::prefix('companies')->group(function () {
    Route::get('/', [\App\Http\Controllers\CompanyController::class, 'index']);
    Route::get('/find/{key}', [\App\Http\Controllers\CompanyController::class, 'search']);
    Route::post('/check-duplicate', [\App\Http\Controllers\CompanyController::class, 'checkDuplicate']);
    Route::post('/check-unique-edit', [\App\Http\Controllers\CompanyController::class, 'checkUniqueEdit']);
});

//profile

Route::put('/profile/{id}/update_info', 'ProfileController@updateUserInfo');
Route::post('/profile/{id}/update_password', 'ProfileController@updatePassword');
Route::post('/profile/{id}/update_avatar', 'ProfileController@updateAvatar');
Route::resource('/profile', ProfileController::class);
Route::get('/avatar/{id}', [App\Http\Controllers\ProfileController::class, 'avatar']);

Route::get('/check-unique-edit/{id}/{name}/{period}/{is_week}', [App\Http\Controllers\MilestoneController::class, 'checkUniqueEdit']);
Route::get('/check-unique-add/{name}/{period}/{is_week}', [App\Http\Controllers\MilestoneController::class, 'checkUniqueAdd']);

// file
Route::get('/file/member', 'FileController@getMember');
Route::get('/file/{id}/getLatest', 'FileController@getLatest');
Route::get('/file/getPath', 'FileController@getPath');
Route::post('/file/{jfId}/delArray', 'FileController@destroyArrayOfDocument');
Route::get('/file/find', [App\Http\Controllers\FileController::class, 'search']);
Route::prefix('file')->group(function () {
    Route::get('/{jfId}', [App\Http\Controllers\FileController::class, 'index']);
    Route::post('/', [App\Http\Controllers\FileController::class, 'store']);
    Route::get('/{id}', [App\Http\Controllers\FileController::class, 'show']);
    Route::put('/{id}/edit', [App\Http\Controllers\FileController::class, 'update']);
    Route::delete('/{id}/destroy', [App\Http\Controllers\FileController::class, 'destroy']);
    Route::get('/getPath', [App\Http\Controllers\FileController::class, 'getPath']);
});
// member detail
Route::prefix('members')->group(function () {
    Route::get('/{id}', [MemberDetailController::class, 'memberDetail']);
    Route::delete('/{id}', [MemberDetailController::class, 'deleteMember']);
});

//Notification

Route::resource('/notification', NotificationController::class);
Route::get('/notification/delete/{id}', 'NotificationController@destroy');
Route::get('/notification/show-unread/{id}', 'NotificationController@showUnread');
Route::post('/notification/update/{id}', 'NotificationController@update');
Route::get('/notification/update_all_read/{id}', 'NotificationController@updateAllRead');

//task
Route::resource('/task', 'TaskController');
Route::get('/before-tasks/{id}', 'TaskController@getBeforeTasks');
Route::get('/after-tasks/{id}', 'TaskController@getAfterTasks');
Route::get('/users', 'MemberController@getMember');
Route::get('/isAssignee/{taskID}/{userID}', 'TaskController@checkAssignee');
Route::get('/task/{id}/reviewers', 'TaskController@getReviewers');
Route::get('/task/{id}/list-reviewers', 'TaskController@getListReviewers');
Route::get('/is-admin-task', 'TaskController@checkRole');
Route::get('/getusersamecategory/{id}', 'TaskController@getUserSameCategory');
Route::put('/updatemanager/{id}', 'TaskController@updateManagerTask');
Route::get('/list-before-and-after-tasks/{idMilestone}', 'TaskController@getListBeforeAndAfterTasks');
// top-page
Route::prefix('/top-page')->group(function () {
    Route::get('/task-reviewer', [TopPageTasksController::class, 'taskReviewer']);
    Route::get('/tasks', [TopPageTasksController::class, 'tasks']);
    Route::get('/user/{id}/jobfair', [TopPageTasksController::class, 'getTaskList']);
    Route::get('/jobfairs', 'JobfairController@index');
    Route::get('/members', [MemberController::class, 'index']);
});

// task kanban
Route::get('/kanban/{id}', [TaskController::class, 'getTaskByJfId']);
Route::get('/kanban/{jfId}/{userId}', [TaskController::class, 'getJobfair']);
Route::put('/kanban/updateTask/{id}', [TaskController::class, 'updateTask']);

// comment
Route::apiResource('/comment', CommentController::class);
Route::get('/show-more-comment/{id}', 'CommentController@showMore');
Route::get('/jobfair-comment/{JFid}', 'CommentController@showMoreInJobfair');
Route::delete('/comment/{id}', 'CommentController@destroy');
Route::post('/comment/{id}', 'CommentController@update');

//status
Route::get('/status/{jobfair_id}/{user_id}/{task_id}', [StatusController::class, 'getStatus']);
Route::get('/task-role/{jobfair_id}/{user_id}/{task_id}', [StatusController::class, 'getTaskRole']);
Route::put('/update-status/{user_id}/{task_id}', [StatusController::class, 'updateStatus']);
