from typing import Annotated, Tuple

from fastapi import Depends, Header, HTTPException, Cookie

from server.connect.storage import get_storage

from dataclasses import dataclass
from server.connect.connection import Connection
from server.connect.session import Session, parse_jwt
from server.connect.storage import Storage


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


async def get_context_from_header(
        storage: Annotated[Storage, Depends(get_storage)],
        authorization: Annotated[str, Header()],
) -> Context:
    token = authorization.split(" ")[1]
    return await _get_context(token, storage)


async def get_context_from_cookie(
        storage: Annotated[Storage, Depends(get_storage)],
        authorization: Annotated[str, Cookie()],
) -> Context:
    return await _get_context(authorization, storage)
