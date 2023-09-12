from typing import Annotated, Tuple

from fastapi import FastAPI, Depends, Header, HTTPException
from pydantic import BaseModel, Field

from server.config import config
from server.connect.connection import Connection, ConnectionState
from server.connect.storage import Storage
import server.connect.session as session

app = FastAPI()


def get_storage():
    return Storage()


def get_context(
        storage: Annotated[Storage, Depends(get_storage)],
        authorization: Annotated[str | None, Header()] = None,
):
    error = HTTPException(status_code=401)
    if not authorization:
        raise error

    token = authorization.split(" ")[1]
    ses = session.parse_jwt(token)
    if not ses:
        raise error

    connection = storage.find(ses.connection_id)
    if not connection:
        raise HTTPException(status_code=404)

    return ses, connection


@app.post("/api/connect/create")
def create(storage: Annotated[Storage, Depends(get_storage)]):
    connection = Connection.create(config.connection_ttl_seconds)
    storage.save(connection)

    ses = session.Session(connection_id=connection.connection_id, role=session.Role.TARGET)
    return {
        "token": session.issue_jwt(ses, connection.expires_unix_ts),
        "connection_id": connection.connection_id
    }


@app.post("/api/connect/activate")
def activate(
        connection_id: str,
        storage: Annotated[Storage, Depends(get_storage)]
):
    connection = storage.find(connection_id)
    if not connection:
        raise HTTPException(status_code=404)

    if connection.state != ConnectionState.CREATED and connection.state != ConnectionState.ACTIVATED:
        raise HTTPException(status_code=400)

    connection.activate()
    storage.save(connection)

    ses = session.Session(connection_id=connection_id, role=session.Role.SOURCE)
    return {
        "token": session.issue_jwt(ses, connection.expires_unix_ts)
    }


class Submit(BaseModel):
    url: str = Field(max_length=300)


@app.post("/api/connect/submit")
def submit(
        request: Submit,
        storage: Annotated[Storage, Depends(get_storage)],
        context: Annotated[Tuple[session.Session, Connection], Depends(get_context)]
):
    ses, connection = context
    if connection.state != ConnectionState.ACTIVATED:
        raise HTTPException(status_code=400)

    connection.submit(request.url)
    storage.save(connection)

    return {}
