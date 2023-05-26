import time
import sys
import qi


class StartupNode(object):
    """
    A simple class to react to face detection events.
    """

    def __init__(self, qisession):
        """
        Initialization of qi framework and event detection.
        event list can be found here: http://doc.aldebaran.com/2-5/naoqi-eventindex.html
        """
        super(StartupNode, self).__init__()
        qisession.start()
        session = qisession.session
        # Get the service ALMemory.
        self.memory = session.service("ALMemory")
        # Get ALTabletService service.
        self.tablet_service = session.service("ALTabletService")
        self.connected = False
        self.ready = False
        # Connect the event callback.
        self.touch_subscriber = self.memory.subscriber("TouchChanged")
        self.on_touch_id = self.touch_subscriber.signal.connect(self.on_touch)
        self.motion_service = session.service("ALMotion")
        self.set_my_pepper_straight()

    def on_touch(self, value):
        """
        Callback for event on body touched, show webpage if the robot is ready and one of its arms was touched.
        """
        print(value)
        if value[0][0] and (value[0][0] in ["LArm", "RArm"]) and self.ready:
            print("Arm touched")
            self.tablet_service.cleanWebview()
            if self.tablet_service.showWebview("http://198.18.0.1/apps/tablet/index.html"):
                self.connected = True
                self.touch_subscriber.signal.disconnect(self.on_touch_id)

    def set_my_pepper_straight(self):
        """
        set the robot straight on startup
        """
        self.motion_service.setAngles("HeadPitch", 0.0, 0.1)
        self.motion_service.setAngles("HeadYaw", 0.0, 0.1)
        self.motion_service.setAngles("KneePitch", 0.0, 0.1)
        self.motion_service.setAngles("HipRoll", 0.0, 0.1)
        self.motion_service.setAngles("HipPitch", -0.1, 0.1)
        self.motion_service.setBreathEnabled("Body", 0)

    def run(self):
        """
        Loop on, wait for events until manual interruption.
        """
        try:
            while True:
                time.sleep(1)
        except KeyboardInterrupt:
            self.touch_subscriber.signal.disconnect(self.on_touch_id)
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

    startup = StartupNode(app)
    startup.run()