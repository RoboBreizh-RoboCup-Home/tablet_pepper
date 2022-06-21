#! /usr/bin/env python
# ----------------------------------------------------------------------------
# Authors  : Cedric BUCHE (buche@enib.fr)
# Created Date: 2022
# ---------------------------------------------------------------------------

import rospy
from std_msgs.msg import String
from sensor_msgs.msg import Image, CameraInfo
import cv2
import numpy as np
import sys
import math
import message_filters
import time
from datetime import datetime

from kmeans_cv2_python3 import detect_colors

#########################################################################################
# variables
#########################################################################################

DISPLAY = 1
DESCRIBE_PERSON = 1
CV_BRIDGE_USED = 0
TABLET_USED = 1
DETECT_AGE = 1
DETECT_COLOR = 1
DETECT_DISTANCE = 1
DISPLAY_DELAY = 0
DISPLAY_ALL_DELAY = 0


#########################################################################################
if CV_BRIDGE_USED == 1:
    from cv_bridge import CvBridge, CvBridgeError
else:
    from nobridgeUtil_python3 import imgmsg_to_cv2, imgmsg_to_cv2_nocolor, cv2_to_imgmsg

if TABLET_USED == 1:
    import qi
    from tablet_python3 import Tablet
    import argparse


if DESCRIBE_PERSON == 1:
    from perception_pepper.msg import Person

#########################################################################################
# TERMINAL color
#########################################################################################
W = '\033[0m'  # white (normal)
R = '\033[31m'  # red
G = '\033[32m'  # green
O = '\033[33m'  # orange
B = '\033[34m'  # blue
P = '\033[35m'  # purple
CYAN = '\033[96m'


#########################################################################################
class RobobreizhCV_Detector():
    def __init__(self, session=None):
        rospy.init_node('object_detection_buche', anonymous=True)

        # tablet
        self.initTablet()

        # bridge
        if CV_BRIDGE_USED == 1:
            self.bridge = CvBridge()

        # object
        self.initObjectDetector()

        # age
        self.initAgeDetector()

        # camera
        self.initCameras()

        # display on PC
        self.initDisplay()

        # person information
        self.initPersonDescription()

        # spin
        rospy.on_shutdown(self.cleanup)		# What we do during shutdown
        self.t0 = time.time()
        self.t1 = time.time()
        print("Waiting for image topics...")
        rospy.spin()

    ######################################################################
    # CAMERA
    ######################################################################

    def initCameras(self):
        self.camera_info_sub = message_filters.Subscriber(
            '/naoqi_driver/camera/front/camera_info', CameraInfo)
        self.image_sub = message_filters.Subscriber(
            "/naoqi_driver/camera/front/image_raw", Image)
        self.depth_sub = message_filters.Subscriber(
            "/naoqi_driver/camera/depth/image_raw", Image)
        self.ts = message_filters.ApproximateTimeSynchronizer(
            [self.image_sub, self.depth_sub, self.camera_info_sub], queue_size=10, slop=0.5)
        self.ts.registerCallback(self.callback)

    ######################################################################
    # Person
    ######################################################################

    def initPersonDescription(self):
        if DESCRIBE_PERSON == 1:
            self.pub_person = rospy.Publisher(
                '/roboBreizh_detector/person', Person, queue_size=1)

    ######################################################################
    # VIEWERs on the PC
    ######################################################################
    def initDisplay(self):
        if DISPLAY == 1:
            self.pub_cv = rospy.Publisher(
                '/roboBreizh_detector/perception', Image, queue_size=1)
            self.pub_kmeans = rospy.Publisher(
                '/roboBreizh_detector/perception_kmeans', Image, queue_size=1)

    ######################################################################
    # TABLET
    ######################################################################
    def initTablet(self):
        self.textTablet = ' [RoboBreizh - Vision] '
        self.textTablet2 = ''
        if TABLET_USED == 1:
            self.tablet = Tablet(session, pkgName="roboBreizh")
            self.tablet.createHTML(
                text="[RoboBreizh - Vision] - started", logo=True, fileName="test.html")
            self.tablet.display_html("test.html")
        if TABLET_USED == 1:
            rospy.Timer(rospy.Duration(3), self.routineTablet)

    def routineTablet(self, event):
        self.tablet.display_resetWebview()
        self.tablet.createHTML(
            text=self.textTablet, text2=self.textTablet2, logo=True, fileName="test.html")
        self.tablet.display_html("test.html")

    ######################################################################
    # OBJECT
    ######################################################################
    def initObjectDetector(self):
        config_file = './models/ssd_mobilenet_v2_oid_v4/graph.pbtxt'
        frozen_model = './models/ssd_mobilenet_v2_oid_v4/frozen_inference_graph.pb'
        file_name = './models/ssd_mobilenet_v2_oid_v4/objects.names.en'
        with open(file_name, 'rt') as fpt:
            self.classes = fpt.read().rstrip('\n').split('\n')
        self.colors = np.random.uniform(0, 255, size=(len(self.classes), 3))
        self.cvNet = cv2.dnn.readNetFromTensorflow(frozen_model, config_file)

    ######################################################################
    # AGE
    ######################################################################
    def initAgeDetector(self):
        self.age_model = cv2.dnn.readNetFromCaffe(
            "./models/age/deploy_age.prototxt", "./models/age/age_net.caffemodel")

    def agePrediction(self, cropped):
        age_prediction = ''
        ageRange = ''
        t40 = time.time()
        if cropped.size != 0:
            blob_age = cv2.dnn.blobFromImage(cropped, 1, (227, 227))
            self.age_model.setInput(blob_age)
            age_prediction = self.age_model.forward()
            ageList = ['(0-2)', '(4-6)', '(8-12)', '(15-20)',
                       '(25-32)', '(38-43)', '(48-53)', '(60-100)']
            ageRange = ageList[age_prediction[0].argmax()]
            t50 = time.time()
            if DISPLAY_ALL_DELAY == 1:
                print("    --> AGE detection delay " + str(round(t50-t40, 2)))
        else:
            print(O+'     ObjectDetector agePrediction cropped image  EMPTY'+W)
        return ageRange

    ######################################################################
    # COLOR
    ######################################################################

    def colorDetection(self, cropped, classe):
        # save mapping picture every 10 seconds
        timing = datetime.now()
        date_time = timing.strftime("%m_%d_%Y_%H_%M_%S")

        color_res = ''
        t400 = time.time()

        color_resize_factor = 10
        if DISPLAY == 1:
            color_resize_factor = 15

        ok, color_res, center_sorted, mapping = detect_colors(
            cropped, num_clusters=5, num_iters=50, resize_factor=color_resize_factor, crop_factor=100, type="rgb", name=str(classe))
        # ok, color_res, center_sorted = detect_colors(
        #     cropped, date_time, num_clusters=5, num_iters=50, resize_factor=10, crop_factor=100, type="rgb", name=str(classe))
        if ok:
            t500 = time.time()
            if DISPLAY_ALL_DELAY == 1:
                print("    --> COLOR detection delay " +
                      str(round(t500-t400, 2)))
        # else:
            #print(O+'     ObjectDetector colorDetection NOT ok'+W)
        return ok, color_res, mapping

    ######################################################################
    # DISTANCE
    ######################################################################
    def detectDistance(self, depth_image, left, bottom, top, right, camera_info):

        # 0,0
        # |          |
        # |          |
        # |          |
        # --------   max X, max Y

        # left,top ------
        # |          |
        # |          |
        # |          |
        # --------right,bottom

        # cut the depth_image a litle bit
        w = int(right - left)
        h = int(bottom - top)
        if w > 0 and h > 0:
            marginh = int(h/4)
            marginw = int(w/4)
        else:
            marginh = 0
            marginw = 0
            print(O+"distance w: "+str(w) + " h: "+str(h)+W)

        roi_depth = depth_image[int(top+marginh):int(bottom-marginh),
                                int(left+marginw):int(right-marginw)]   # [y:y+h, x:x+w]
        if roi_depth.size == 0:
            print(O+'     roi_depth image  EMPTY'+W)
            print(O+'       depth_image image  starting point ' +
                  str(left+marginw) + ',' + str(bottom-marginh)+W)
            print(O+'       depth_image image  end point ' +
                  str(top+marginh) + ','+str(right-marginw)+W)
            roi_depth = depth_image

        if roi_depth.shape[0] == 0 or roi_depth.shape[1] == 0:
            print(
                O+'    detectDistance roi_depth.shape[0] == 0 or roi_depth.shape[1]'+W)
            print(
                O+'            + roi_depth.shape[1] : '+str(roi_depth.shape[1])+W)
            print(
                O+'            + roi_depth.shape[0] : '+str(roi_depth.shape[0])+W)
            roi_depth = depth_image

        # compute mean Z
        n = 0
        sum = 0
        for i in range(0, roi_depth.shape[0]):			# height
            for j in range(0, roi_depth.shape[1]):  # width
                value = roi_depth.item(i, j)
                if value > 0.:
                    n = n + 1
                    sum = sum + value
        if (n != 0):
            mean_z = sum / n
        else:
            mean_z = 0

        mean_distance = mean_z * 0.001  # distance in meters

        # 0,0
        # |          |
        # |          |
        # |          |
        # --------   max X, max Y

        # left,top ------
        # |          |
        # |          |
        # |          |
        # --------right,bottom

        # Z
        # /
        # /
        # /
        # /
        # ------ > x
        # |
        # |
        # |
        # |
        # y

        #  calculate the middle point
        Xcenter = ((right-left)/2)+left
        Ycenter = ((bottom-top)/2)+top

        # get the distance of that point (Z coordinate)
        Zcenter = mean_distance

        # camera
        camera_info_K = np.array(camera_info.K)

        # Intrinsic camera matrix for the raw (distorted) images.
        #     [fx  0 cx]
        # K = [ 0 fy cy]
        #     [ 0  0  1]

        m_fx = camera_info.K[0]
        m_fy = camera_info.K[4]
        m_cx = camera_info.K[2]
        m_cy = camera_info.K[5]
        inv_fx = 1. / m_fx
        inv_fy = 1. / m_fy

        # pinhole model of a camera
        point_z = Zcenter
        point_x = ((Xcenter-m_cx) * Zcenter) / m_fx
        point_y = ((Ycenter-m_cy) * Zcenter) / m_fy

        dist = math.sqrt(point_x * point_x + point_y *
                         point_y + point_z * point_z)
        return dist, point_x, point_y, point_z

    ######################################################################
    # MAIN LOOP
    ######################################################################

    def callback(self, rgb_data, depth_data, camera_info):

        print(CYAN+"[RoboBreizh - Vision] detection "+W)
        if DISPLAY_DELAY == 1:
            print("     --> acquisition delay " +
                  str(round(self.t1 - self.t0, 2)))
        self.t0 = self.t1

        self.t1 = time.time()

        #################### ROS msg to CV image ####################################
        if CV_BRIDGE_USED == 1:
            cv_rgb = self.bridge.imgmsg_to_cv2(rgb_data, "bgr8")
            depth_image = self.bridge.imgmsg_to_cv2(depth_data, "32FC1")
        else:
            cv_rgb = imgmsg_to_cv2(rgb_data, "bgr8")
            # 16UC1 to 32FC1 (no color needed)
            depth_image = imgmsg_to_cv2_nocolor(depth_data, "32FC1")

        #################### 3d CAM ####################################

        depth_array = np.array(depth_image, dtype=np.float32)
        cv2.normalize(depth_array, depth_array, 0, 1, cv2.NORM_MINMAX)
        depth_8 = (depth_array * 255).round().astype(np.uint8)
        cv_depth = np.zeros_like(cv_rgb)
        cv_depth[:, :, 0] = depth_8
        cv_depth[:, :, 1] = depth_8
        cv_depth[:, :, 2] = depth_8

        #################### OBJECT DETECTION ####################################
        frame = np.array(cv_rgb, dtype=np.uint8)
        if frame.size == 0:
            print(O+'     ObjectDetector frame RGB image EMPTY'+W)
        t2 = time.time()
        h = frame.shape[0]
        w = frame.shape[1]
        imageBGR = np.array(frame)
        blob = cv2.dnn.blobFromImage(imageBGR, size=(
            300, 300), swapRB=False, crop=False)
        self.cvNet.setInput(blob)
        outputs = self.cvNet.forward()
        width = imageBGR.shape[1]
        height = imageBGR.shape[0]
        #print(O+'     ObjectDetector frame RGB image width: '+str(width)+W)
        #print(O+'     ObjectDetector frame RGB image height: '+str(height)+W)

        objects = {}
        self.textTablet = ' [RoboBreizh - Vision]  :'
        self.textTablet2 = ''
        person = None

        mappingImages = []
        font = cv2.FONT_HERSHEY_SIMPLEX
        fontScale = .3
        thickness = 1

        for detection in outputs[0, 0, :, :]:
            bKNN = False
            score = float(detection[2])
            if score > 0.3:
                classID = int(detection[1])
                classe = self.classes[classID - 1]

                left = int(detection[3] * width)
                top = int(detection[4] * height)
                right = int(detection[5] * width)
                bottom = int(detection[6] * height)

                if top < 0:
                    print(O+'     ObjectDetector resize top to zero: '+str(top)+W)
                    top = 0
                if left < 0:
                    print(O+'     ObjectDetector resize top to zero: '+str(left)+W)
                    left = 0
                if right < 0:
                    print(O+'     ObjectDetector resize top to zero: '+str(right)+W)
                    right = 0
                if bottom < 0:
                    print(O+'     ObjectDetector resize top to zero: '+str(bottom)+W)
                    bottom = 0
                # left,top ---
                # |          |
                # |          |
                # |          |
                # --------right,bottom

                cropped = frame[int(top):int(bottom), int(
                    left):int(right)]   # [y:y+h, x:x+w]

                ############## human ##############
                if DESCRIBE_PERSON == 1:
                    if classe == "Man" or classe == "Woman":
                        if person == None:
                            person = Person()
                        if classe == "Man":
                            person.gender = "M"
                        else:
                            person.gender = "F"

                ############## age ##############
                text_age = ''
                if DETECT_AGE == 1:
                    if classe == "Human face":
                        if cropped.size != 0:
                            age = self.agePrediction(cropped)
                            text_age = "--- " + str(age) + ' years'

                            if DESCRIBE_PERSON == 1:
                                if person == None:
                                    person = Person()
                                person.age = age

                        else:
                            print(
                                O+'     ObjectDetector (DETECT_AGE) cropped image EMPTY'+W)
                            print(O+'        + top: '+str(top)+W)
                            print(O+'        + bottom: '+str(bottom)+W)
                            print(O+'        + right: '+str(right)+W)
                            print(O+'        + left: '+str(left)+W)

                ############## color ##############
                text_color = ''
                color_res = ''
                if DETECT_COLOR == 1:
                    if cropped.size != 0:
                        bKNN, color_res, mapping = self.colorDetection(
                            cropped, classe)

                        text_color = "--- " + str(color_res)
                        color_str = "color: " + str(color_res)
                    # --------------------------------------------------
                    if bKNN == 1:
                        mapping2 = cv2.resize(
                            mapping, (cropped.shape[1], cropped.shape[0]), interpolation=cv2.INTER_AREA)

                        cv2.rectangle(
                            mapping2, (0, 0), (cropped.shape[1], 15), self.colors[classID - 1], thickness=-1)
                        cv2.putText(mapping2, str(classe), (10, 10), font,
                                    fontScale, (0, 0, 0), thickness, cv2.LINE_AA)
                        cv2.putText(mapping2, color_str, (int(10), int(
                            cropped.shape[0] / 2)), font, fontScale, self.colors[classID - 1], thickness, cv2.LINE_AA)

                        mappingImages.append(mapping2)

                    # --------------------------------------------------

                        if DESCRIBE_PERSON == 1 and person != None and classe == "Human face":
                            person.skin_color = color_res
                        elif DESCRIBE_PERSON == 1 and person != None:
                            person.clothes_color = color_res

                    else:
                        print(
                            O+'     ObjectDetector (DETECT_COLOR) cropped image EMPTY'+W)
                        print(O+'        + top: '+str(top)+W)
                        print(O+'        + bottom: '+str(bottom)+W)
                        print(O+'        + right: '+str(right)+W)
                        print(O+'        + left: '+str(left)+W)
                        print(O+'        + detection[4]: '+str(detection[4])+W)
                        print(O+'        + detection[6]: '+str(detection[6])+W)
                        print(O+'        + detection[5]: '+str(detection[5])+W)
                        print(O+'        + detection[3]: '+str(detection[3])+W)

                ############## distance ##############
                dist, point_x, point_y, point_z = 0, 0, 0, 0

                if DETECT_DISTANCE == 1:
                    if depth_image.size == 0:
                        print(O+'     depth_image image  EMPTY'+W)

                    else:
                        dist, point_x, point_y, point_z = self.detectDistance(
                            depth_image, left, bottom, top, right, camera_info)
                        if DESCRIBE_PERSON == 1 and person != None:
                            person.distance = dist

                ############## describe person ##############
                if DESCRIBE_PERSON == 1 and person != None:
                    person_message = person
                    self.pub_person.publish(person_message)
                    person = None

                ############## display ##############

                # left,top ------
                # |          |
                # |          |
                # |          |
                # --------right,bottom

                if DISPLAY == 1:

                    if classe in objects:
                        objects[classe] += 1
                    else:
                        objects[classe] = 1
                    text_classe_confidence = "{}: {:.2f}%".format(
                        classe, score*100)

                    # rectangle
                    # (startX, startY), (endX, endY)
                    cv2.rectangle(cv_rgb, (left, top), (right, bottom),
                                  self.colors[classID - 1], thickness)

                    # text classe / confidence
                    y_text = top - 5 if top - 5 > 5 else top + 5
                    max_x = left + 150 if left + 150 < right else right - 5

                    cv2.rectangle(cv_rgb, (int(left), int(y_text-10)), (int(max_x),
                                  int(top)), self.colors[classID - 1], thickness=-1)		# background
                    cv2.putText(cv_rgb, text_classe_confidence, (int(left), int(
                        y_text)), font, fontScale, (0, 0, 0), thickness, cv2.LINE_AA)

                    # distance
                    cv2.rectangle(cv_depth, (left+10, top+10),
                                  (right-10, bottom-10), self.colors[classID - 1], thickness=1)

                    x_str = "X: " + str(format(point_x, '.2f'))
                    y_str = "Y: " + str(format(point_y, '.2f'))
                    z_str = "Z: " + str(format(point_z, '.2f'))

                    cv2.putText(cv_depth, x_str, (left+10, top + 20), font,
                                fontScale, self.colors[classID - 1], thickness, cv2.LINE_AA)
                    cv2.putText(cv_depth, y_str, (left+10, top + 30), font,
                                fontScale, self.colors[classID - 1], thickness, cv2.LINE_AA)
                    cv2.putText(cv_depth, z_str, (left+10, top + 40), font,
                                fontScale, self.colors[classID - 1], thickness, cv2.LINE_AA)

                    dist_str = "dist:" + str(format(dist, '.2f')) + "m"
                    cv2.putText(cv_depth, dist_str, (left+10, top + 60), cv2.FONT_HERSHEY_SIMPLEX,
                                fontScale, self.colors[classID - 1], thickness, cv2.LINE_AA)

                self.textTablet2 = self.textTablet2 + ('<li>' + str(classe) + ' (' + str(int(
                    score*100)) + '%) --- ' + str(format(dist, '.2f')) + ' m ' + str(text_age) + ' ' + str(text_color)+'</li>')

                ############## end display ##############
                print('     -->  ' + str(classe) + ' (' + str(int(score*100)) + '%) --- ' +
                      str(format(dist, '.2f')) + ' m' + str(text_age) + ' ' + str(text_color))

        t3 = time.time()

        ###### publish Image with detection + distance ################
        if DISPLAY_DELAY == 1:
            print(("     --> TOTAL detection delay " + str(round(t3 - t2, 2))))

        if DISPLAY == 1:
            rgbd = np.concatenate((cv_rgb, cv_depth), axis=1)

            if CV_BRIDGE_USED == 1:
                perception_message = self.bridge.cv2_to_imgmsg(rgbd, "bgr8")
            else:
                perception_message = cv2_to_imgmsg(rgbd, "bgr8")

            self.pub_cv.publish(perception_message)

        ###### publish Image with kmeans ################
        if DISPLAY == 1:

            max_height = 0
            for i in range(len(mappingImages)):
                mapping = mappingImages[i]
                if (mapping.shape[0] > max_height):
                    max_height = mapping.shape[0]

            max_height += 10

            for i in range(len(mappingImages)):
                mapping = mappingImages[i]
                top2 = int((max_height - mapping.shape[0]) / 2)
                bottom2 = max_height - mapping.shape[0] - top2
                if (top2 < 0):
                    top2 = 0
                if (bottom2 < 0):
                    bottom2 = 0
                mapping = cv2.copyMakeBorder(
                    mapping, top2, bottom2, 5, 5, cv2.BORDER_CONSTANT)
                if (i == 0):
                    mapping_concat = mapping
                else:
                    mapping_concat = np.concatenate(
                        (mapping_concat, mapping), axis=1)

            if CV_BRIDGE_USED == 1 and len(mappingImages) != 0:
                kmeans_message = self.bridge.cv2_to_imgmsg(
                    mapping_concat, "bgr8")
            elif len(mappingImages) != 0:
                kmeans_message = cv2_to_imgmsg(mapping_concat, "bgr8")
            if len(mappingImages) != 0:
                self.pub_kmeans.publish(kmeans_message)

        ###### END publish kmeans ################

        # timing
        self.t1 = time.time()

    #########################################################################
    ############ WHAT TO DO AT THE END #################
    #########################################################################
    def cleanup(self):
        print("Shutting down vision node.")
        if TABLET_USED == 1:
            self.tablet.display_resetWebview()
            self.tablet.display_resetImage()
        cv2.destroyAllWindows()


#########################################################################
if __name__ == '__main__':

    if TABLET_USED == 1:
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

        RobobreizhCV_Detector(session)
    else:
        RobobreizhCV_Detector()