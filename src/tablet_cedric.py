#!/usr/bin/env python
import qi
import argparse
import sys
import time

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

    def display_image(self, imgName):
        self.alTablet.preLoadImage(self.ip_access+"/img/"+imgName)
        self.alTablet.showImage(self.ip_access+"/img/"+imgName)

    def display_resetWebview(self):
        self.alTablet.hideWebview()

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
                      logo=True, fileName="test.html")
    tablet.display_html("test.html")
    time.sleep(30)
    tablet.display_resetWebview()
    tablet.display_resetImage()
    tablet.display_image("CROSSING-logo-new.png")
    time.sleep(30)
    tablet.display_resetImage()
