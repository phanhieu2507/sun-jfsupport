<h1>Hello {{$user->name}}</h1>
<p>
    You can reset password from bellow link: <br><br>
    <a href="{{ url('/reset-password/?token=' . $token) }}">Reset Password</a>
</p>