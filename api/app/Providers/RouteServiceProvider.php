<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * The path to the "home" route for your application.
     *
     * This is used by Laravel authentication to redirect users after login.
     *
     */
    public const HOME = '/home';

    /**
     * The controller namespace for the application.
     *
     * When present, controller route declarations will automatically be prefixed with this namespace.
     *
     * @var string|null
     */
    protected $namespace = 'App\\Http\\Controllers';

    /** @var  string */
    protected $adminNamespace = 'App\Http\Controllers\Admin';

    /**
     * Define your route model bindings, pattern filters, etc.
     *
     * @return void
     */
    public function boot()
    {
        $this->configureRateLimiting();
    }

    /**
     * Define  the  routes  for  the  application.
     *
     * @return  void
     */
    public function map()
    {
        $this->mapApiRoutes();

        $this->mapWebRoutes();

        $this->mapAdminRoutes();
    }

    /**
     * Define  the  "web"  routes  for  the  application.
     *
     * These  routes  all  receive  session  state,  CSRF  protection, etc.
     *
     * @return  void
     */
    protected function mapWebRoutes()
    {
        Route::middleware('web')
            ->namespace($this->namespace)
            ->group(base_path('routes/web.php'));
    }

    /**
     * Define  the  "api"  routes  for  the  application.
     *
     * These  routes  are  typically  stateless.
     *
     * @return  void
     */
    protected function mapApiRoutes()
    {
        Route::prefix('api')
            ->middleware(['web'])
            ->namespace($this->namespace)
            ->group(base_path('routes/api.php'));
    }

    /*
     * Define  the  "admin"  routes  for  the  application.
     *
     * These  routes  are  typically  stateless.
     *
     * @return  void
     */
    protected function mapAdminRoutes()
    {
        Route::prefix('api')
            ->middleware(['web', 'admin'])
            ->namespace($this->namespace)
            ->group(base_path('routes/admin.php'));
    }

    /**
     * Configure the rate limiters for the application.
     *
     * @return void
     */
    protected function configureRateLimiting()
    {
        RateLimiter::for('api', function (Request $request) {
            return Limit::perMinute(60)->by(optional($request->user())->id ?: $request->ip());
        });
    }
}
