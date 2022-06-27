#!/usr/bin/env python
import qi
import argparse
import sys
import time
import subprocess
import rospkg
import os
import rospy
from std_msgs.msg import String, UInt32
from sensor_msgs.msg import Image
import cv2
from cv_bridge import CvBridge, CvBridgeError
import numpy as np
from vizbox.msg import Story
# Tablet class contains all variables & functions to allow Pepper to communicate with his Tablet


class Tablet:

    def __init__(self, session, pkgName="roboBreizh"):
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
        print("displaying html")
        try:
            self.alTablet.showWebview(self.ip_access+"/"+fileName)
        except Exception as e:
            print("Error was: ", e)

    def createHTML(self, fileName, subtitle='', story=''):
        print("creating html")
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
            <h1 id="title">Help me Carry</h1>
            <hr style="border-color: white;">
        </div>
        <div class="content center">
            Robot Camera Image
            <br>
            <img    id="visualization_img"
                    src="img_raw.png">
        </div>
        <div class="sidebar">
           <!--{#<h2>Robocup@Home Events</h2>#}-->
            <ol id="storyline">
                <li>Get operator</li>
                <li><b>Follow to car</b></li>
                <li>Take bag</li>
                <li>Hear destination</li>
                <li>Find human</li>
                <li>Guide to car</li>
                  <!--{% for line in storyline %}
                    {% block line %}
                      <li>{{line}}</li>
                    {% end %}
                    {% end %}-->
            </ol>
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
                    <li class="robot_text subtitle-line">Robot : Ok, I will follow you</li>
                    <li class="operator_text subtitle-line">Operator : Follow me</li>
                    <li class="robot_text subtitle-line">Robot : Hello operator</li>
                </ul>
                </div>
        <script src="static/scripts/script.js"></script>
    </body>
</html>
"""
        f = open(self.ip_access_write+"/"+fileName, "w+")
        f.write(base_html)
        f.close()


class PublishTopic():
    def __init__(self):
        rospy.init_node('publish_topic', anonymous=True)

        # What we do during shutdown
        rospy.on_shutdown(self.cleanup)

        # Create the cv_bridge object
        self.bridge = CvBridge()
        self.story = None
        self.title = None
        self.storyline = None
        self.robot_text = None
        self.operator_text = None
        self.challenge_step = None

        self.robot_text_pub = rospy.Publisher('/robot_text', String, queue_size=10)
        self.robot_text_sub = rospy.Subscriber('/robot_text', String, self.robot_text_callback)
        self.operator_text_pub = rospy.Publisher('/operator_text', String, queue_size=10)
        self.operator_text_sub = rospy.Subscriber('/operator_text', String, self.operator_text_callback)
        #self.image_pub = rospy.Publisher('/image_raw', Image, queue_size=100)
        self.story_pub = rospy.Publisher('/story', Story, queue_size=10)
        self.story_sub = rospy.Subscriber('/story', Story, self.story_callback)
        self.challenge_step_pub = rospy.Publisher('/challenge_step', UInt32, queue_size=10)
        self.challenge_step_sub = rospy.Subscriber('/challenge_step', UInt32, self.challenge_step_callback)

        # Subscribe to the camera image and depth topics and set the appropriate callbacks
        self.image_sub = rospy.Subscriber("/naoqi_driver/camera/front/image_raw", Image, self.image_callback2)

        print("Waiting for image topics...")
       # self.tablet = Tablet(session, pkgName="roboBreizh")
       # self.tablet.share_localhost("/home/nao/.local/share/PackageManager/apps/roboBreizh")
       # self.tablet.createHTML(fileName="challenge_test.html")
       # self.tablet.display_html("challenge_test.html")
       # time.sleep(0.5)

        rospy.spin()

    def robot_text_callback(self, ros_msg):
        self.robot_text = ros_msg.data
        print("robot:", self.robot_text)
        if not os.path.exists("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt"):
            open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt", "x")
        text_file = open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt")
        robot_operator_text = text_file.read()
        text_file.close()
        text_file = open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt", "w+")
        robot_operator_text = """<li class="robot_text subtitle-line">{value}</li>""".format(value=self.robot_text) + robot_operator_text
        text_file.write(robot_operator_text)
        text_file.close()

    def operator_text_callback(self, ros_msg):
        self.operator_text = ros_msg.data
        print("operator:", self.operator_text)
        if not os.path.exists("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt"):
            open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt", "x")
        text_file = open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt")
        robot_operator_text = text_file.read()
        text_file.close()
        text_file = open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/robot_operator_text.txt", "w+")
        robot_operator_text = """<li class="operator_text subtitle-line">{value}</li>""".format(value=self.operator_text) + robot_operator_text
        text_file.write(robot_operator_text)
        text_file.close()

    def challenge_step_callback(self, ros_msg):
        self.challenge_step = str(ros_msg.data)
        print("challenge_step:", self.challenge_step)
        text_file = open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/challenge_step.txt", "w+")
        text_file.write(self.challenge_step)
        text_file.close()


    def story_callback(self, ros_msg):
        self.story = ros_msg
        print(self.story)
        self.title, self.storyline = self.story.title, self.story.storyline
        print("title", self.title)
        text_file = open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/story_title.txt", "w")
        text_file.write(self.title)
        text_file.close()

        print("storyline", self.storyline)
        text_file = open("/home/nao/.local/share/PackageManager/apps/roboBreizh/html/storyline.txt", "w")
        storyline_str = ""
        for line in self.storyline:
            storyline_str += "<li>"+line+"</li>"
        text_file.write(storyline_str)
        text_file.close()

    def image_callback2(self, ros_image):
       # self.image_pub.publish(ros_image)
        try:
            img = self.bridge.imgmsg_to_cv2(ros_image, "rgb8")
        except CvBridgeError as e:
            print(e)
        cv2.imwrite('/home/nao/.local/share/PackageManager/apps/roboBreizh/html/img_raw.png', img)
       # print('saving images')

    def cleanup(self):

        print("Shutting down node.")


def get_pkg_path(package):
    rp = rospkg.RosPack()
    return(rp.get_path(package))

if __name__ == '__main__':
    #parser = argparse.ArgumentParser()
    #parser.add_argument("--ip", type=str, default="127.0.0.1",
    #                    help="Robot IP address. On robot or Local Naoqi: use '127.0.0.1'.")
    #parser.add_argument("--port", type=int, default=9559,
    #                    help="Naoqi port number")

    #args = parser.parse_args()
    #session = qi.Session()
    #try:
    #    session.connect("tcp://" + args.ip + ":" + str(args.port))
    #except RuntimeError:
    #    print(("Can't connect to Naoqi at ip \"" + args.ip + "\" on port " + str(args.port) + ".\n"
    #           "Please check your script arguments. Run with -h option for help."))
    #    sys.exit(1)

    # Test
   ## tablet = Tablet(session, pkgName="roboBreizh")
   # tablet.createHTML(fileName="challenge_test.html")
   # base_path = get_pkg_path('vizbox')
   # actual_path = os.path.join(base_path, 'src')
   # print(actual_path)
   ## tablet.share_localhost("/home/nao/.local/share/PackageManager/apps/roboBreizh")

    PublishTopic()

   # while(True):
        # TODO subscribe to message from camera + speech
        #tablet.createHTML(text="hello CROSSING ...", logo=True, fileName="test.html")
        ##tablet.createHTML(fileName="challenge_test.html")
        ##tablet.display_html("challenge_test.html")
        ##time.sleep(0.5)

       # tablet.tablet_show_local_image("test.html")
       # tablet.display_resetWebview()
       # tablet.display_resetImage()
       # tablet.display_image("screenshot.png")
       # time.sleep(3)
       # tablet.display_resetImage()
