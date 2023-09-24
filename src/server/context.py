from dataclasses import dataclass
from typing import Annotated

from fastapi import Depends, HTTPException, Cookie

from server.connect.connection import Connection
from server.connect.session import Session, parse_jwt
from server.connect.storage import Storage
from server.connect.storage import get_storage


@dataclass
class Context:
    connection: Connection
    session: Session


async def _get_context(token: str, storage: Storage) -> Context:
    ses = parse_jwt(token)
    if not ses:
        raise HTTPException(status_code=401)

    connection = await storage.find(ses.connection_id)
    if not connection:
        raise HTTPException(status_code=404)

    return Context(connection, ses)


async def get_context_from_cookie(
        storage: Annotated[Storage, Depends(get_storage)],
        authorization: Annotated[str, Cookie()],
) -> Context:
    return await _get_context(authorization, storage)
