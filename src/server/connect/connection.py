import time
import uuid
from enum import IntEnum


class ConnectionState(IntEnum):
    CREATED = 1
    ACTIVATED = 2
    SUBMITTED = 3
    COMPLETED = 4
    EXPIRED = 5


class Connection:
    connection_id: str
    state: ConnectionState
    url: str
    ttl_seconds: int

    def __init__(self, connection_id: str,
                 ttl_seconds: int,
                 state: ConnectionState = ConnectionState.CREATED,
                 url: str = None
                 ):
        self.connection_id = connection_id
        self.state = state
        self.url = url
        self.ttl_seconds = ttl_seconds

    @staticmethod
    def create(ttl_seconds: int):
        return Connection(connection_id=uuid.uuid4().hex, ttl_seconds=ttl_seconds)

    def activate(self):
        self.state = ConnectionState.ACTIVATED

    def submit(self, url: str):
        self.state = ConnectionState.SUBMITTED
        self.url = url

    def complete(self):
        self.state = ConnectionState.COMPLETED
