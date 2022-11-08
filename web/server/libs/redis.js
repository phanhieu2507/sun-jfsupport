import redis from 'redis'
import {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_PASSWORD,
} from '../env'

/**
 * @var RedisClient
 */
export default redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: (REDIS_PASSWORD.length > 0 && REDIS_PASSWORD !== 'null') ? REDIS_PASSWORD : undefined,
})
