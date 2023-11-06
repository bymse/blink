from collections.abc import AsyncIterator

import redis.asyncio as redis

from config import config

from connect.connection import Connection, ConnectionState


def create_redis_pool():
    return redis.ConnectionPool.from_url(config.redis_url)


redis_pool = create_redis_pool()


class Storage:
    _pubsub: redis.client.PubSub | None = None
    _redis: redis.Redis

    def __init__(self):
        self._redis = redis.Redis(connection_pool=redis_pool)

    async def save(self, connection: Connection) -> None:
        key = _key(connection.connection_id)
        await self._redis.hset(key, mapping={
            'state': int(connection.state),
            'url': connection.url or ''
        })

        if connection.state == ConnectionState.CREATED:
            await self._redis.expire(key, connection.ttl_seconds)

        await self._redis.publish(key, int(connection.state))

    async def find(self, connection_id: str) -> Connection | None:
        key = _key(connection_id)
        connection = await self._redis.hgetall(key)
        if not connection or len(connection) == 0:
            return None

        expires = await self._redis.ttl(key)
        return Connection(
            connection_id=connection_id,
            ttl_seconds=expires,
            state=ConnectionState(int(connection[b'state'])),
            url=str(connection[b'url'], 'utf-8')
        )

    async def listen(self, connection_id: str) -> AsyncIterator[Connection]:
        key = _key(connection_id)
        self._pubsub = self._redis.pubsub()
        await self._pubsub.subscribe(key)
        async for message in self._pubsub.listen():
            if message['type'] == 'message':
                yield await self.find(connection_id)

    async def close_listen(self):
        if self._pubsub:
            await self._pubsub.close()


def _key(connection_id: str) -> str:
    return f'connection:{connection_id}'


def get_storage() -> Storage:
    return Storage()
