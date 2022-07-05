#!/usr/bin/env python
import qi
import argparse
import sys
import time
import subprocess
import rospkg
import os

# Tablet class contains all variables & functions to allow Pepper to communicate with his Tablet


class Tablet:

    def __init__(self, session, pkgName="roboBreizh"):
        self.challenge_step_value = 0
        self.session = session
        self.alTablet = self.session.service("ALTabletService")
        self.pkgName = pkgName
        self.ip_access = "http://198.18.0.1/apps/" + pkgName
        self.ip_access_write = "/home/nao/.local/share/PackageManager/apps/" + pkgName+"/html"

    def __del__(self):
        self.session.close()

    def share_localhost(self, folder):
        """
        Shares a location on localhost via HTTPS to Pepper be
        able to reach it by subscribing to IP address of this
        computer.
        :Example:
        >>> pepper.share_localhost("/Users/pepper/Desktop/web/")
        :param folder: Root folder to share
        :type folder: string
        """
        # TODO: Add some elegant method to kill a port if previously opened
        try:
            subprocess.Popen(["python3", "-m", "http.server"], cwd=folder)
            print("[INFO]: HTTPS server successfully started")
        except Exception as error:
            print("[ERROR]: HTTPS server failed")


    def tablet_show_local_image(self, image_url):
        """
        Display image on robot tablet
        .. seealso:: For more take a look at `tablet_show_web()`
        :Example:
        >>> pepper.tablet_show_image("https://goo.gl/4Xq6Bc")
        For local images: run share_localhost() first
        :param image_url: Image URL (local or web)
        :type image_url: string
        """
        self.alTablet.showImage("http://198.18.0.1:8000/"+image_url)

    def display_image(self, imgName):
        self.alTablet.preLoadImage(self.ip_access+"/img/"+imgName)
        self.alTablet.showImage(self.ip_access+"/img/"+imgName)

    def display_resetWebview(self):
        self.alTablet.hideWebview()

    def display_Webview(self, url):
        self.alTablet.showWebview(url)

    def display_resetImage(self):
        self.alTablet.hideImage()

    def display_html(self, fileName="challenge.html"):
        try:
            self.alTablet.showWebview(self.ip_access+"/"+fileName)
        except Exception as e:
            print("Error was: ", e)

    def createHTML(self, fileName, subtitle='', story=''):
        storyline_value = ""
        title_value = ""
        robot_operator_text_value = ""

        if(os.path.exists("html/storyline.txt")):
            f = open("html/storyline.txt")
            storyline_value = f.read()
            f.close()
        if(os.path.exists("html/story_title.txt")):
            f = open("html/story_title.txt")
            title_value = f.read()
            f.close()
        if(os.path.exists("html/robot_operator_text.txt")):
            f = open("html/robot_operator_text.txt")
            robot_operator_text_value = f.read()
            f.close()
        if(os.path.exists("html/challenge_step.txt")):
            f = open("html/challenge_step.txt")
            value = f.read()
            f.close()
            if(value=='3'):
                self.challenge_step_value=0
                print("challenge_step_value reset to 0", self.challenge_step_value)
            elif(value=='1'):
                self.challenge_step_value+=1
                print("challenge_step_value incremented by 1", self.challenge_step_value)
                os.remove("html/challenge_step.txt")
            else:
                print("invalid instruction for challenge step", self.challenge_step_value)
        storyline_split = storyline_value.split("</li>")
        #print(len(storyline_split))
        if(os.path.exists("html/storyline.txt") and len(storyline_split)-1 > self.challenge_step_value):
            storyline_split[self.challenge_step_value] = storyline_split[self.challenge_step_value].replace("<li>", "<li><b>")
            storyline_split[self.challenge_step_value]+="</b>"
        else: print("error: challenge step not exist")
        storyline_value = ""
        for line in storyline_split:
            storyline_value += line + "</li>"
        base_html = """
<!doctype html>
<html>
    <head>
        <link rel="stylesheet" href="static/stylesheets/style.css">
        <script src="static/scripts/jquery-3.3.1.min.js"></script>
        <link rel="stylesheet" href="static/stylesheets/bootstrap.min.css">
        <script src="static/scripts/bootstrap.min.js"></script>

        <link rel="shortcut icon" href="static/favicon.ico">

    </head>
    <body class="main">

        <div class="header">
            <h1 id="title">{title_value}</h1>
            <hr style="border-color: white;">
        </div>

        <div class="content center">
            Robot Camera Image
            <br>
            <img    id="visualization_img"
                    src="img_raw.png">
        </div>

        <div class="sidebar">
           <!--{{#<h2>Robocup@Home Events</h2>#}}-->
            <ol id="storyline">{storyline_value}</ol>
        </div>

        <div class="footer-button center">
                        <div  class="btn-group-vertical" style="width:75%;">
                            <button type="button" id="btn1" class="btn btn-primary ">Next Step</button>
                            <button type="button" id="btn2" class="btn btn-danger ">Stop</button>
                        </div>
                </div>

                <div class="footer-text">
                        <ul id="subtitles">
                        <!-- Dummies to test style -->
                    {robot_operator_text_value}
                </ul>
                </div>
        <script src="static/scripts/script.js"></script>
    </body>
</html>
""".format(title_value=title_value, storyline_value=storyline_value, robot_operator_text_value=robot_operator_text_value)
        f = open(self.ip_access_write+"/"+fileName, "w+")
        f.write(base_html)
        f.close()

def get_pkg_path(package):
    rp = rospkg.RosPack()
    return(rp.get_path(package))

if __name__ == '__main__':
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
        print(("Can't connect to Naoqi at ip \"" + args.ip + "\" on port " + str(args.port) + ".\n"
               "Please check your script arguments. Run with -h option for help."))
        sys.exit(1)

    # Test
    tablet = Tablet(session, pkgName="roboBreizh")
   # tablet.createHTML(fileName="challenge_test.html")
   # base_path = get_pkg_path('vizbox')
   # actual_path = os.path.join(base_path, 'src')
   # print(actual_path)
    tablet.share_localhost("/home/nao/.local/share/PackageManager/apps/roboBreizh")

    while(True):
        # TODO subscribe to message from camera + speech
        #tablet.createHTML(text="hello CROSSING ...", logo=True, fileName="test.html")
        tablet.createHTML(fileName="challenge.html")
        tablet.display_html("challenge.html")
        time.sleep(0.5)

       # tablet.tablet_show_local_image("test.html")
       # tablet.display_resetWebview()
       # tablet.display_resetImage()
       # tablet.display_image("screenshot.png")
       # time.sleep(3)
       # tablet.display_resetImage()
