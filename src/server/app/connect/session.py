from __future__ import annotations

import time
from dataclasses import dataclass
import enum
import jwt
from config import config


class Role(enum.IntEnum):
    TARGET = 1,
    SOURCE = 2


_issuer = 'blink.bymse.me'


@dataclass
class Session:
    connection_id: str
    role: Role


def issue_jwt(session: Session, ttl_seconds: int) -> str:
    payload = {
        "sub": session.connection_id,
        "issuer": _issuer,
        "exp": int(time.time()) + ttl_seconds,
        "role": int(session.role)
    }
    key = bytes(config.rsa_private_key, encoding="utf-8")
    return jwt.encode(payload, key, algorithm="RS256")


def parse_jwt(token: str) -> Session | None:
    try:
        payload = jwt.decode(token, config.rsa_public_key, algorithms="RS256")
        return Session(
            connection_id=payload['sub'],
            role=Role(int(payload['role']))
        )
    except jwt.exceptions.PyJWTError as e:
        return None
