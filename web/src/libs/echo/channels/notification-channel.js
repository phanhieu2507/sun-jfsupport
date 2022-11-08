import echo from '../connection'

export default class NotificationChannel {
  constructor(userId) {
    this.userId = userId
    this.channel = echo.private(`App.Models.User.${userId}`)
    this.onOutputCb = null
  }

  listen() {
    this.channel.notification((output) => {
      this.onOutputCb(output)
    })

    return this
  }

  leave() {
    echo.leave(this.channel.name)
  }

  onOutput(cb) {
    this.onOutputCb = cb
    return this
  }
}
