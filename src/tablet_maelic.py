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

    def display_html(self, fileName="index.html"):
        try:
            self.alTablet.showWebview(self.ip_access+"/"+fileName)
        except Exception as e:
            print("Error was: ", e)

    def createHTML(self, fileName, text=None, logo=None, text2=None):
        if (logo == None):

            # Create an html file with the string
            html = """\
			<html>
				<head>
        			<meta name="viewport"
              				content="target-densitydpi=device-dpi,
                           		width=device-width,
                                   	initial-scale = 1,
                                   	minimum-scale = 1,
                                   	maximum-scale = 1" />
    				<title>Test BUCHE</title>
				<style>
					html, body {{
        				height: 100%;
        				width: 100%;
        				border: 0px;
        				padding: 0px;
        				margin: 0px;
				}}
				</style>
				</head>
				<body>
					<h1 style="position: absolute; color: red; top: 30%; font-size: 60px;">{value}</h1>
				</body>
			</html>
			""".format(value=text)

            f = open(self.ip_access_write+"/"+fileName, "w+")
            f.write(html)
            f.close()
        elif (text2):
            html = """\
			<html>
				<head>
        			<meta name="viewport"
              				content="target-densitydpi=device-dpi,
                           		width=device-width,
                                   	initial-scale = 1,
                                   	minimum-scale = 1,
                                   	maximum-scale = 1" />
    				<title>Test BUCHE</title>
				<style>
					html, body {{
        				height: 100%;
        				width: 100%;
        				border: 0px;
        				padding: 0px;
        				margin: 0px;
				}}
				</style>
				</head>
				<body>
        				<img src="img/CROSSING-logo.jpg" style="width:50%"><br><br>
					<a href="http://crossing.cnrs.fr">http://crossing.cnrs.fr</a><br><br><br><br><br>
					<div style="color: red; font-size: 30px;text-align: center">{value}
						<div style="color: red; font-size: 30px;text-align: left;margin-left:30px">{value2}
						</div>
					</div>
				</body>
			</html>
			""".format(value=text, value2=text2)

            f = open(self.ip_access_write+"/"+fileName, "w+")
            f.write(html)
            f.close()

        else:
            html = """\
			<html>
				<head>
        			<meta name="viewport"
              				content="target-densitydpi=device-dpi,
                           		width=device-width,
                                   	initial-scale = 1,
                                   	minimum-scale = 1,
                                   	maximum-scale = 1" />
    				<title>Test BUCHE</title>
				<style>
					html, body {{
        				height: 100%;
        				width: 100%;
        				border: 0px;
        				padding: 0px;
        				margin: 0px;
				}}
				</style>
				</head>
				<body>
        				<img src="img/CROSSING-logo.jpg" style="width:50%"><br><br>
					<a href="http://crossing.cnrs.fr">http://crossing.cnrs.fr</a><br><br><br><br><br>
					<div style="color: red; font-size: 30px;text-align: center">{value}</div>
				</body>
			</html>
			""".format(value=text)

            f = open(self.ip_access_write+"/"+fileName, "w+")
            f.write(html)
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
    tablet.createHTML(text="hello CROSSING ...",
                      logo=True,
                      fileName="test.html")
    # base_path = get_pkg_path('vizbox')
    # actual_path = os.path.join(base_path, 'src')
    # print(actual_path)
    tablet.share_localhost(base_path)

    while(True):
        # TODO subscribe to message from camera + speech
        tablet.createHTML(text="hello CROSSING ...",
                          logo=True,
                          fileName="test.html")
        tablet.display_html("test.html")

        tablet.tablet_show_local_image("test.html")
        tablet.display_resetWebview()
        tablet.display_resetImage()
        tablet.display_image("screenshot.png")
        time.sleep(3)
        tablet.display_resetImage()