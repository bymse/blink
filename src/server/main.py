from typing import Annotated

from fastapi import FastAPI, Depends, HTTPException, Header, Request
from fastapi.websockets import WebSocketState, WebSocket
from pydantic import BaseModel, Field

from server.config import config
from server.connect.connection import Connection, ConnectionState
from server.connect.storage import Storage, get_storage
from server.context import Context
from server.connect.session import Session, issue_jwt, Role
from server.context import get_context_from_cookie

app = FastAPI()


def verify_origin(origin: str):
    if origin and origin != config.allowed_origin:
        raise HTTPException(status_code=403)


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    origin = request.headers.get('origin')
    verify_origin(origin)

    return await call_next(request)


@app.post("/api/connect/create")
async def create(storage: Annotated[Storage, Depends(get_storage)]):
    connection = Connection.create(config.connection_ttl_seconds)
    await storage.save(connection)

    ses = Session(connection_id=connection.connection_id, role=Role.TARGET)
    return {
        "token": issue_jwt(ses, connection.ttl_seconds),
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
        raise HTTPException(status_code=403)

    connection.activate()
    await storage.save(connection)

    ses = Session(connection_id=connection_id, role=Role.SOURCE)
    return {
        "token": issue_jwt(ses, connection.ttl_seconds)
    }


@app.websocket("/ws-api/connect/listen")
async def listen(websocket: WebSocket,
                 ctxt: Annotated[Context, Depends(get_context_from_cookie)],
                 storage: Annotated[Storage, Depends(get_storage)],
                 origin: Annotated[str, Header()]):
    verify_origin(origin)

    session, connection = ctxt.session, ctxt.connection
    if session.role != Role.TARGET:
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
        ctxt: Annotated[Context, Depends(get_context_from_cookie)]
):
    session, connection = ctxt.session, ctxt.connection
    err = HTTPException(status_code=403)
    if session.role != Role.SOURCE:
        raise err

    if connection.state != ConnectionState.ACTIVATED:
        raise err

    connection.submit(request.url)
    await storage.save(connection)

    return {}


@app.post('/api/connect/complete')
async def complete(
        storage: Annotated[Storage, Depends(get_storage)],
        ctxt: Annotated[Context, Depends(get_context_from_cookie)]
):
    session, connection = ctxt.session, ctxt.connection
    err = HTTPException(status_code=403)
    if session.role != Role.TARGET:
        raise err

    if connection.state != ConnectionState.SUBMITTED:
        raise err

    connection.complete()
    await storage.save(connection)

    return {}


@app.post('/api/connect/decline')
async def decline(
        storage: Annotated[Storage, Depends(get_storage)],
        ctxt: Annotated[Context, Depends(get_context_from_cookie)]
):
    session, connection = ctxt.session, ctxt.connection
    err = HTTPException(status_code=403)
    if session.role != Role.TARGET:
        raise err

    if connection.state != ConnectionState.SUBMITTED:
        raise err

    connection.decline()
    await storage.save(connection)

    return {}
