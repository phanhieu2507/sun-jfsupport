import echo from '../connection'

export default class CommentChannel {
  constructor() {
    this.channel = echo.channel('comment-channel')
  }

  listen(cb) {
    this.channel.listen('CommentCreated', cb)
    return this
  }

  leave() {
    echo.leave(this.channel.name)
  }
}
