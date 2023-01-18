#!/usr/bin/env python
# -*- coding: utf-8 -*-

import qi
import sys
import threading
import time


class TabletNode(object):
    """
    Show in the tablet what the robot hears and says.
    """

    def __init__(self, session):
        super(TabletNode, self).__init__()
        self.tablet_service = session.service("ALTabletService")
        self.connected = False

    def load_webpage(self):
        self.tablet_service.cleanWebview() # Clean the web browser.
        while True:
            # The ip of the robot from the tablet is 198.18.0.1
            if self.tablet_service.showWebview("http://198.18.0.1/apps/tablet/index.html"): 
                break
            else:
                print("Couldn't load website on tablet.")
                time.sleep(3)
        print("Displaying website on the tablet")

def main():
    addr = "tcp://localhost:9559"

    session = qi.Session()
    try:
        session.connect(addr)
    except RuntimeError:
        print("Can't connect to Naoqi")
        sys.exit(1)

    tablet_node = TabletNode(session)
    tablet_node.load_webpage()

if __name__ == "__main__":
    main()
