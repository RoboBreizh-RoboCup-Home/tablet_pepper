import qi
import argparse
import sys
import time

def main(session):
    """
    This example uses the showWebview method.
    To Test ALTabletService, you need to run the script ON the robot.
    """
    # Get the service ALTabletService.

    try:
        tabletService = session.service("ALTabletService")

        tabletService.wakeUp()

        # Ensure that the tablet wifi is enable

        tabletService.enableWifi()
        print(tabletService.robotIp())

        # Display a web page on the tablet
        tabletService.showWebview("http://www.google.com")

        time.sleep(300)

        # Display a local web page located in boot-config/html folder
        # The ip of the robot from the tablet is 198.18.0.1

        url = "http://192.168.50.44:8888"
        print("url ", url)
        tabletService.showWebview(url)
        tabletService.reloadPage(1)
        # tabletService.showWebview("https://webflow.com/interactions-animations")
        # tabletService.loadUrl("http://192.168.50.44:8888")

        # Hide the web view
        tabletService.hideWebview()

    except Exception as e:
        print("Error was: ", e)

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", type=str, default="127.0.0.1",
                        help="Robot IP address. On robot or Local Naoqi: use '127.0.0.1'.")
    parser.add_argument("--port", type=int, default=9559,
                        help="Naoqi port number")

    args = parser.parse_args()
    session = qi.Session()
    try:
        session.connect("tcp://" + args.ip + ":" + str(args.port))
    except RuntimeError:
        print ("Can't connect to Naoqi at ip \"" + args.ip + "\" on port " + str(args.port) +".\n"
               "Please check your script arguments. Run with -h option for help.")
        sys.exit(1)
    main(session)
