from typing import Annotated

from fastapi import FastAPI, Depends

from server.config import config
from server.connect.connection import Connection
from server.connect.storage import Storage
import server.connect.session as session

app = FastAPI()


def get_storage():
    return Storage()


@app.post("/api/connect/create")
def create(storage: Storage = Annotated[Storage, Depends(get_storage)]):
    connection = Connection.create(config.config.connection_ttl_seconds)
    storage.save(connection)
    ses = session.Session(connection_id=connection.connection_id, role=session.Role.TARGET)

    return {
        "token": session.issue_jwt(ses, connection.expires_unix_ts),
        "connection_id": connection.connection_id
    }
