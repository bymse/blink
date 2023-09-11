import redis
import server.config as config

from session import Session


def create_redis_pool():
    return redis.ConnectionPool.from_url(config.config.redis_url)


redis_pool = create_redis_pool()


class Storage:
    def __init__(self):
        self.redis = redis.Redis(connection_pool=redis_pool)

    def save(self, session: Session) -> None:
        self.redis.hset(_key(session.session_id), mapping={
            'state': session.state,
            'link': session.link
        })
        self.redis.expire(_key(session.session_id), config.config.session_ttl_seconds)

    def find(self, session_id: str) -> Session | None:
        session = self.redis.hgetall(_key(session_id))
        if session:
            return None

        return Session(session_id=session_id, state=session['state'], link=session['link'])


def _key(session_id: str) -> str:
    return f'session:{session_id}'
