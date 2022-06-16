#!/usr/bin/env python

import asyncio
import websockets

@asyncio.coroutine
def hello():
    websocket = yield from websockets.connect('ws://192.168.50.44:8888/')
    name = input("What's your name? ")
    yield from websocket.send(name)
    print("> {}".format(name))
    greeting = yield from websocket.recv()
    print("< {}".format(greeting))

asyncio.get_event_loop().run_until_complete(hello())