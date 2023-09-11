from typing import Annotated, Tuple

from fastapi import FastAPI, Depends, Header, HTTPException

from server.config import config
from server.connect.connection import Connection
from server.connect.storage import Storage
import server.connect.session as session

app = FastAPI()


def get_storage():
    return Storage()


def get_context(
        header: Annotated[str | None, Header("Authorization")],
        storage: Annotated[Storage, Depends(get_storage)]):
    error = HTTPException(status_code=401)
    if not header:
        raise error

    token = header.split(" ")[1]
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

    connection.activate()
    storage.save(connection)

    ses = session.Session(connection_id=connection_id, role=session.Role.SOURCE)
    return {
        "token": session.issue_jwt(ses, connection.expires_unix_ts)
    }
