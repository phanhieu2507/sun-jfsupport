import Echo from 'laravel-echo'
import cookies from 'axios/lib/helpers/cookies'
import Socketio from 'socket.io-client'

export default new Echo({
  broadcaster: 'socket.io',
  namespace: 'App.Events.Broadcasting',
  client: Socketio,
  reconnectionAttempts: 2,
  reconnectionDelay: 5000,
  auth: {
    headers: {
      'X-XSRF-TOKEN': cookies.read('XSRF-TOKEN'),
    },
  },
})
