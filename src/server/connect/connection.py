import uuid
from enum import Enum


class ConnectionState(Enum):
    CREATED = 1
    ACTIVATED = 2
    SUBMITTED = 3
    COMPLETED = 4
    EXPIRED = 5


class Connection:
    connection_id: str
    state: ConnectionState
    url: str

    def __init__(self, connection_id: str, state: ConnectionState = ConnectionState.CREATED, url: str = None):
        self.connection_id = connection_id
        self.state = state
        self.url = url

    @staticmethod
    def create():
        return Connection(connection_id=uuid.uuid4().hex)

    def activate(self):
        self.state = ConnectionState.ACTIVATED

    def submit(self, url: str):
        self.state = ConnectionState.SUBMITTED
        self.url = url

    def complete(self):
        self.state = ConnectionState.COMPLETED
