import time
import sys
import qi

class StartupNode(object):
    """
    A simple class to react to face detection events.
    """

    def __init__(self, qisession):
        super(StartupNode, self).__init__()
        qisession.start()
        session = qisession.session
        self.tablet_service = session.service("ALTabletService")
        self.tablet_service.showWebview("http://198.18.0.1/apps/tablet/index.html")	

if __name__ == "__main__":
    try:
        # Initialize qi framework.
        connection_url = "tcp://localhost:9559"
        app = qi.Application(["TabletNode" "--qi-url=" + connection_url])
    except RuntimeError:
        print ("Can't connect to Naoqi")
        sys.exit(1)

    startup = StartupNode(app)
