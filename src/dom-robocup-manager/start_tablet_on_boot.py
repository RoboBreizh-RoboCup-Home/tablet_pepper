import time
import sys
import qi


class TabletNode(object):
    """
    A simple class to react to face detection events.
    """

    def __init__(self, qisession):
        """
        Initialisation of qi framework and event detection.
        """
        super(TabletNode, self).__init__()
        qisession.start()
        session = qisession.session
        # Get the service ALMemory.
        self.memory = session.service("ALMemory")
        self.tablet_service = session.service("ALTabletService")
        # Get ALTabletService service.
        self.connected = False
        # Connect the event callback.
        self.subscriber = self.memory.subscriber("ALDiagnosis/RobotIsReady")
        self.subscriber.signal.connect(self.on_robot_ready)


    def on_robot_ready(self, value):
        """
        Callback for event robot ready.
        """
        self.tablet_service.cleanWebview() # Clean other web browsers   .
        if self.tablet_service.showWebview("http://198.18.0.1/apps/tablet/index.html"):
            self.connected = True

    def run(self):
        """
        Loop on, wait for events until manual interruption.
        """
        try:
            while self.connected is not False:
                time.sleep(1)
        except KeyboardInterrupt:
            self.memory.unsubscribe("ALDiagnosis/RobotIsReady")
            #stop
            sys.exit(0)


if __name__ == "__main__":
    try:
        # Initialize qi framework.
        connection_url = "tcp://localhost:9559"
        app = qi.Application(["TabletNode" "--qi-url=" + connection_url])
    except RuntimeError:
        print ("Can't connect to Naoqi")
        sys.exit(1)

    show_page = TabletNode(app)
    show_page.run()
