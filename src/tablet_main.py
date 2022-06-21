#!/usr/bin/env python
import rospy
import qi
import time

import paramiko
import scp
import re


## Tablet class contains all variables & functions to allow Pepper to communicate with his Tablet

class Tablet:

    ## The constructor of the Tablet class (at initialization, we connect to the tablet)
    # Two attributes: self.session (a Naoqi Session) and self.alTablet (a ALMemory)
    # @param self The object pointer
    # @param ip Pepper's ip adress
    def __init__(self, ip):
        # Naoqi session
        self.session = qi.Session()
        self.session.connect("tcp://" + ip + ":" + "9559")
        # ALMemory callback (to get the variable)
        self.alTablet = self.session.service("ALTabletService")
        # For SSH connection to Pepper 2 (change username and/or password if needed)
        self.host = ip
        self.port = 22
        self.username = "nao"
        self.password = "pep2enib"
        self.ssh = None
        self.scp = None

    ## The destructor of the Tablet class (at destruction, we disconnect from the tablet)
    # @param self The object pointer
    def __del__(self):
        self.session.close()

    ## Establish a ssh connection to Pepper's head (modify self.username and self.password if not using Pepper 2)
    # @param self The object pointer
    def establishSSH(self):
        self.ssh = paramiko.SSHClient()
        self.ssh.load_system_host_keys()
        self.ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        self.ssh.connect(self.host, self.port, self.username, self.password)

    ## Copy file from source to destination
    # @param self The object pointer
    # @param source Local file path
    # @param destination Destination path where you want to copy your file (depend on ssh host, here the path should be something like "/home/nao/..." because we have established a ssh connect to Pepper's 2 head)
    def copy(self, source, destination):
        self.scp = scp.SCPClient(self.ssh.get_transport())
        self.scp.put(source, destination)
        self.scp.close()

    ##
    # @param self The object pointer
    # @param text String you want to display in a html file on Pepper's tablet
    # @param If True, there will be only a text in the HTML. If False, there will be only an image in the HTML.
    def createHTML(self, text, boolean):
        # print(text)
        if (boolean):
            # # Pretty string of what Pepper said
            # text = text.split(' ')
            # l=len(text)
            # del text[0]
            # del text[l-2]
            # text = ' '.join(text)

            x = re.search("^\S+", text).group(0)
            y = re.search("(\S+ *)$", text).group(0)

            print("CE QU'IL FAUT ENLEVER x : ", x, "y : ", y)
            print("type", type(x))

            if ("Dialog" in x):
                text = text.replace(x, '')
            if ("Dialog" in y):
                text = text.replace(y, '')

            print("new string : ", text)

            # Create an html file with the string
            html = """\
			<html>
				<head>
					<meta name="viewport" content="width=1280, user-scalable=no"/>
				</head>
				<body>
					<h1 style="position: absolute; top: 30%; text-align: center; font-size: 60px;">{value}</h1>
				</body>
			</html>
			""".format(value=text)

            f = open("/home/master/PRI_2020_RoboCup@Home/src/dialog/src/dialog/demofile.html", "w")
            f.write(html)
            f.close()

        else:
            html = """\
			<html>
				<head>
					<meta name="viewport" content="width=1280, user-scalable=no"/>
				</head>
				<body>
					<img align="center" src="./img/demo_server.png" width="1280"/>
				</body>
			</html>
			""".format()

            f = open("/home/master/PRI_2020_RoboCup@Home/src/dialog/src/dialog/demofile.html", "w")
            f.write(html)
            f.close()

    ## Close ssh connection
    # @param self The object pointer
    def closeSSH(self):
        self.ssh.close()

    ## Display RoboBreizh logo on the tablet
    # @param self The object pointer
    def display_image(self, imgName):
        self.alTablet.showImage("http://198.18.0.1/apps/hotel/img/" + imgName + ".png")
        time.sleep(10)

    ## Hide image currently displayed
    # @param self The object pointer
    def display_init(self):
        self.alTablet.hideImage()

    ## Display index.html on the tablet (file located in Pepper's tablet memory)
    # @param self The object pointer
    def display_html(self):
        self.alTablet.loadUrl("http://198.18.0.1/apps/hotel/index.html")
        self.alTablet.showWebview("http://198.18.0.1/apps/hotel/index.html")


if __name__ == '__main__':
    pepper_ip = '192.168.50.44'
    tablet = Tablet(pepper_ip)
    tablet.copy('example.png', '198.18.0.1:/apps/hotel/img/')
    tablet.display_image('example')
    print('test')