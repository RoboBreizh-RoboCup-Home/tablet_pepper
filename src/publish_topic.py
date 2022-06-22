#! /usr/bin/env python

import rospy
from std_msgs.msg import String, UInt32
from sensor_msgs.msg import Image
import cv2
from cv_bridge import CvBridge, CvBridgeError
import numpy as np
from vizbox.msg import Story

class PublishTopic():
    def __init__(self):
        rospy.init_node('face_detection_buche', anonymous=True)

        # What we do during shutdown
        rospy.on_shutdown(self.cleanup)

        # Create the cv_bridge object
        self.bridge = CvBridge()

        self.robot_text_pub = rospy.Publisher('/robot_text', String, queue_size=10)
        self.operator_text_pub = rospy.Publisher('/operator_text', String, queue_size=10)
        self.image_pub = rospy.Publisher('/image_raw', Image, queue_size=100)
        self.story_pub = rospy.Publisher('/story', Story, queue_size=10)
        self.challenge_step_pub = rospy.Publisher('/challenge_step', UInt32, queue_size=10)

        # Subscribe to the camera image and depth topics and set the appropriate callbacks
        self.image_sub = rospy.Subscriber("/naoqi_driver/camera/front/image_raw", Image, self.image_callback2)

        print("Waiting for image topics...")
        rospy.spin()

    def image_callback2(self, ros_image):
        self.image_pub.publish(ros_image)
        try:
            img = self.bridge.imgmsg_to_cv2(ros_image, "bgr8")
        except CvBridgeError as e:
            print(e)
        cv2.imwrite('/home/nao/.local/share/PackageManager/apps/roboBreizh/html/img_raw.png', img)
        print('publishing images')

    def cleanup(self):
        print("Shutting down node.")


if __name__ == '__main__':
        PublishTopic()
