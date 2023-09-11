import uuid
from enum import Enum


class SessionState(Enum):
    CREATED = 1
    ACTIVATED = 2
    SUBMITTED = 3
    COMPLETED = 4
    EXPIRED = 5


class Session:
    session_id: str
    state: SessionState
    link: str

    def __init__(self, session_id: str, state: SessionState = SessionState.CREATED, link: str = None):
        self.session_id = session_id
        self.state = state
        self.link = link

    @staticmethod
    def create():
        return Session(session_id=uuid.uuid4().hex)

    def activate(self):
        self.state = SessionState.ACTIVATED

    def submit(self, link: str):
        self.state = SessionState.SUBMITTED
        self.link = link

    def complete(self):
        self.state = SessionState.COMPLETED
