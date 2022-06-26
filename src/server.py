#! /usr/bin/env python3

import json
import signal
from socket import error

import time
from tornado.ioloop import IOLoop
from tornado.web import Application, RequestHandler, StaticFileHandler
from tornado.websocket import WebSocketHandler

from backendbase import BackendBase
from rosbackend import RosBackend
import asyncio

# import threading

CMD_BTN1 = "Next Step"
CMD_BTN2 = "Stop"


class ChallengeHandler(RequestHandler):
    def initialize(self, backend):
        self.backend = backend

    def get(self):
        print("Rendering...")
        self.render("challenge.html",
                    visualization="Robot camera image",
                    title=self.backend.title,
                    storyline=self.backend.storyline
                    )

    def post(self):
        if self.get_argument("btn") == "1":
            print('btn1 pushed')
            self.backend.btn_pushed(CMD_BTN1)

        if self.get_argument("btn") == "2":
            print('btn2 pushed')
            self.backend.btn_pushed(CMD_BTN2)


class CommandReceiver(RequestHandler):
    def initialize(self, backend):
        self.backend = backend

    def post(self, *args, **kwargs):
        command = self.get_argument("command")
        self.backend.accept_command(command)
        print(command)


class MessageForwarder(WebSocketHandler):

    def __init__(self, *args, **kwargs):
        self.backend = kwargs.pop('backend')
        super(MessageForwarder, self).__init__(*args, **kwargs)

    def check_origin(self, origin):
        return True

    def open(self):
        print("opening WebSocket")

        self.backend.attach_operator_text(self.handle_operator_text)
        self.backend.attach_robot_text(self.handle_robot_text)
        self.backend.attach_challenge_step(self.handle_challenge_step)
        self.backend.attach_image(self.handle_image)
        self.backend.attach_story(self.handle_story)

        print("WebSocket opened")

    def on_message(self, message):
        self.write_message(u"You said: " + message)

    def on_close(self):
        print("WebSocket closed")
        self.backend.detach_operator_text(self.handle_operator_text)
        self.backend.detach_robot_text(self.handle_robot_text)
        self.backend.detach_challenge_step(self.handle_challenge_step)
        self.backend.detach_image(self.handle_image)
        self.backend.detach_story(self.handle_story)

    def handle_operator_text(self, text):
        asyncio.set_event_loop(asyncio.new_event_loop())
        print("handle_operator_text({})".format(text))

        data = {"label": "operator_text", "text": "Operator : " + text}
        data = json.dumps(data)

        self.write_message(data)

    def handle_robot_text(self, text):
        asyncio.set_event_loop(asyncio.new_event_loop())
        print("handle_robot_text({})".format(text))

        data = {"label": "robot_text", "text": "Robot : " + text}
        data = json.dumps(data)

        self.write_message(data)

    def handle_challenge_step(self, step):
        asyncio.set_event_loop(asyncio.new_event_loop())
        print("handle_challenge_step({})".format(step))

        data = {"label": "challenge_step", "index": step}
        data = json.dumps(data)

        self.write_message(data)

    # fixme
    def handle_image(self, image):
        # print('handling images')
        asyncio.set_event_loop(asyncio.new_event_loop())
        # print("handle_image({})".format(len(image)))
        # print("image encoded:", image)
        image = image.decode()
        # print("image decoded:", image)
        data = {"label": "image", "image": image}
        data = json.dumps(data)
        # print(data)

        self.write_message(data)


    # title_storyline
    # Minor modifications here
    # the subtitle of the sidebar is set to be the current storyline
    # def handle_story(self, storyline):
    #     asyncio.set_event_loop(asyncio.new_event_loop())
    #     print("handle_story({})".format(storyline))

    #     title, storyline = storyline[0], storyline[1]  # configured

    #     print(title, storyline)

    #     data = {"label": "story", "title": title, "storyline": storyline}
    #     data = json.dumps(data)

    #     self.write_message(data)

    def handle_story(self, title_storyline):
        asyncio.set_event_loop(asyncio.new_event_loop())
        print("handle_story({})".format(title_storyline))

        title, storyline = title_storyline
        print("title:", title)
        print("storyline:", storyline)

        data = {"label": "story", "title": title, "storyline": storyline}
        data = json.dumps(data)

        self.write_message(data)


def handle_shutdown(*arg, **kwargs):
    asyncio.set_event_loop(asyncio.new_event_loop())
    IOLoop.instance().stop()


if __name__ == "__main__":
    backend = RosBackend.get_instance(shutdown_hook=handle_shutdown)

    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGQUIT, handle_shutdown)  # SIGQUIT is send by our supervisord to stop this server.
    signal.signal(signal.SIGTERM, handle_shutdown)  # SIGTERM is send by Ctrl+C or supervisord's default.
    print("Shutdown handler connected")

    app = Application([
        (r"/ws", MessageForwarder, {'backend': backend}),
        (r'/', ChallengeHandler, {'backend': backend}),
        (r'/command', CommandReceiver, {'backend': backend}),
        (r'/static/(.*)', StaticFileHandler, {'path': 'static/'})],
        (r'/(favicon\.ico)', StaticFileHandler, {'path': 'static/favicon.ico'}),
        debug=True,
        template_path="templates")
    # print("app instantiated")

    # robot IP: 192.168.50.44"
    address, port = "localhost", 8888
    print("Application instantiated")

    connected = False
    while not connected:
        try:
            print("Listening...")
            app.listen(port, address)
            print("Listening on http://{addr}:{port}".format(addr=address, port=port))
            connected = True
        except error as ex:
            print("{ex}. Cannot start, trying in a bit".format(ex=ex))
            time.sleep(1)

    print("Starting IOLoop")
    # asyncio.set_event_loop(asyncio.new_event_loop())
    IOLoop.instance().start()