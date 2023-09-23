from typing import Annotated, Tuple

from fastapi import FastAPI, Depends, Header, HTTPException
from fastapi.websockets import WebSocketState, WebSocket
from pydantic import BaseModel, Field

from server.config import config
from server.connect.connection import Connection, ConnectionState
from server.connect.storage import Storage
import server.connect.session as session

app = FastAPI()


def get_storage():
    return Storage()


async def get_context(
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

    connection = await storage.find(ses.connection_id)
    if not connection:
        raise HTTPException(status_code=404)

    return ses, connection


@app.post("/api/connect/create")
def create(storage: Annotated[Storage, Depends(get_storage)]):
    connection = Connection.create(config.connection_ttl_seconds)
    storage.save(connection)

    ses = session.Session(connection_id=connection.connection_id, role=session.Role.TARGET)
    return {
        "token": session.issue_jwt(ses, connection.ttl_seconds),
        "connection_id": connection.connection_id
    }


@app.post("/api/connect/activate")
async def activate(
        connection_id: str,
        storage: Annotated[Storage, Depends(get_storage)]
):
    connection = await storage.find(connection_id)
    if not connection:
        raise HTTPException(status_code=404)

    if connection.state != ConnectionState.CREATED and connection.state != ConnectionState.ACTIVATED:
        raise HTTPException(status_code=400)

    connection.activate()
    await storage.save(connection)

    ses = session.Session(connection_id=connection_id, role=session.Role.SOURCE)
    return {
        "token": session.issue_jwt(ses, connection.ttl_seconds)
    }


@app.websocket("/api/connect/ws/listen")
async def listen(websocket: WebSocket,
                 context: Annotated[Tuple[session.Session, Connection], Depends(get_context)],
                 storage: Annotated[Storage, Depends(get_storage)]):
    ses, connection = context
    if ses.role != session.Role.TARGET:
        raise HTTPException(status_code=403)

    await websocket.accept()
    try:
        async for updated_connection in storage.listen(connection.connection_id):
            if websocket.client_state != WebSocketState.CONNECTED:
                break
            await websocket.send_json({
                "state": updated_connection.state,
                "url": updated_connection.url
            })
    finally:
        await storage.close_listen()


class Submit(BaseModel):
    url: str = Field(max_length=300)


@app.post("/api/connect/submit")
async def submit(
        request: Submit,
        storage: Annotated[Storage, Depends(get_storage)],
        context: Annotated[Tuple[session.Session, Connection], Depends(get_context)]
):
    ses, connection = context
    if ses.role != session.Role.SOURCE:
        raise HTTPException(status_code=403)
    
    if connection.state != ConnectionState.ACTIVATED:
        raise HTTPException(status_code=400)

    connection.submit(request.url)
    await storage.save(connection)

    return {}
