import redis
import server.config as config

from connection import Connection


def create_redis_pool():
    return redis.ConnectionPool.from_url(config.config.redis_url)


redis_pool = create_redis_pool()


class Storage:
    def __init__(self):
        self.redis = redis.Redis(connection_pool=redis_pool)

    def save(self, connection: Connection) -> None:
        self.redis.hset(_key(connection.connection_id), mapping={
            'state': connection.state,
            'url': connection.url
        })
        self.redis.expire(_key(connection.connection_id), config.config.session_ttl_seconds)

    def find(self, connection_id: str) -> Connection | None:
        connection = self.redis.hgetall(_key(connection_id))
        if connection:
            return None

        return Connection(connection_id=connection_id, state=connection['state'], url=connection['url'])


def _key(connection_id: str) -> str:
    return f'connection:{connection_id}'
