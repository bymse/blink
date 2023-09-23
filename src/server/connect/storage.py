from time import time

import redis
from server.config import config

from server.connect.connection import Connection, ConnectionState


def create_redis_pool():
    return redis.ConnectionPool.from_url(config.redis_url)


redis_pool = create_redis_pool()


class Storage:
    _pubsub: redis.client.PubSub | None
    _redis: redis.Redis

    def __init__(self):
        self._redis = redis.Redis(connection_pool=redis_pool)

    def save(self, connection: Connection) -> None:
        key = _key(connection.connection_id)
        self._redis.hset(key, mapping={
            'state': int(connection.state),
            'url': str(connection.url)
        })

        if connection.state == ConnectionState.CREATED:
            self._redis.expire(key, connection.ttl_seconds)

        self._redis.publish(key, int(connection.state))

    def find(self, connection_id: str) -> Connection | None:
        key = _key(connection_id)
        connection = self._redis.hgetall(key)
        if not connection or len(connection) == 0:
            return None

        expires = self._redis.ttl(key)
        return Connection(
            connection_id=connection_id,
            ttl_seconds=expires,
            state=ConnectionState(int(connection[b'state'])),
            url=str(connection[b'url'])
        )

    async def listen(self, connection_id: str) -> AsyncIterator[Connection]:
        key = _key(connection_id)
        self._pubsub = self._redis.pubsub()
        await self._pubsub.subscribe(key)
        async for message in self._pubsub.listen():
            if message['type'] == 'message':
                yield self.find(connection_id)

    async def close_listen(self):
        if self._pubsub:
            await self._pubsub.close()


def _key(connection_id: str) -> str:
    return f'connection:{connection_id}'
