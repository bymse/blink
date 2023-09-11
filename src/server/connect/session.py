from __future__ import annotations

from dataclasses import dataclass
import enum
import jwt
from server.config import config


class Role(enum.Enum):
    TARGET = 1,
    SOURCE = 2


_issuer = 'blink.bymse.me'


@dataclass
class Session:
    connection_id: str
    role: Role


def issue_jwt(session: Session, expires: int) -> str:
    payload = {
        "sub": session.connection_id,
        "issuer": _issuer,
        "exp": expires,
        "role": session.role
    }
    return jwt.encode(payload, config.rsa_private_key, algorithm=["RS256"])


def parse_jwt(token: str) -> Session | None:
    try:
        payload = jwt.decode(token, config.rsa_public_key, algorithms=["RS256"])
        return Session(
            connection_id=payload['sub'],
            role=payload['role']
        )
    except jwt.exceptions.PyJWTError:
        return None
