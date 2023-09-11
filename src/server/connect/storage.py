import redis
import server.config as config

from connection import Connection, ConnectionState


def create_redis_pool():
    return redis.ConnectionPool.from_url(config.config.redis_url)


redis_pool = create_redis_pool()


class Storage:
    def __init__(self):
        self._redis = redis.Redis(connection_pool=redis_pool)

    def save(self, connection: Connection) -> None:
        self._redis.hset(_key(connection.connection_id), mapping={
            'state': connection.state,
            'url': connection.url
        })

        if connection.state == ConnectionState.CREATED:
            self._redis.expire(_key(connection.connection_id), config.config.connection_ttl_seconds)

    def find(self, connection_id: str) -> Connection | None:
        key = _key(connection_id)
        connection = self._redis.hgetall(key)
        if connection:
            return None

        expires = self._redis.ttl(key)
        return Connection(
            connection_id=connection_id,
            expires_unix_ts=expires,
            state=connection['state'],
            url=connection['url']
        )


def _key(connection_id: str) -> str:
    return f'connection:{connection_id}'