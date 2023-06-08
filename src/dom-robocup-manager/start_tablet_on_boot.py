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
        # Get ALTabletService service.
        self.motion_service = session.service("ALMotion")
        self.tablet_service = session.service("ALTabletService")
        self.start_time = qi.clockNow()

    def try_starting(self):
        """
        Check time since booted every second, show webpage if 2 minutes has elapsed.
        """
        current_time = qi.clockNow()
        if (current_time - self.start_time >= 120000000000): # 120 seconds
            self.set_my_pepper_straight()
            self.tablet_service.cleanWebview()
            if self.tablet_service.showWebview("http://198.18.0.1/apps/tablet/index.html"):
                sys.exit(0)

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
                time.sleep(5)
                self.try_starting()
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

