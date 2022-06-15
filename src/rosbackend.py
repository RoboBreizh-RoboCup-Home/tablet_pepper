from backendbase import BackendBase, call_callbacks_in

import rospy
from std_msgs.msg import String, UInt32
from sensor_msgs.msg import Image, CompressedImage

import cv2
import numpy as np
from PIL import Image as pil_image
import base64
from io import StringIO, BytesIO
from vizbox.msg import Story


# try:
#     from vizbox.msg import Story
# except ImportError as e:
#     rospy.logerr(e)


class RosBackend(BackendBase):
    __instance = None

    @staticmethod
    def get_instance(*args, **kwargs):
        if not RosBackend.__instance:
            RosBackend.__instance = RosBackend(*args, **kwargs)
        return RosBackend.__instance


    def __init__(self, shutdown_hook):

        super(RosBackend, self).__init__()
        rospy.init_node("vizbox", log_level=rospy.INFO)
        rospy.logdebug("Node initialized")

        rospy.on_shutdown(shutdown_hook)

        self.__encoding = {'rgb8': self.rgba2base64,
                           'bgr8': self.bgr8_2_base64,
                           'compressed': self.compressed2base64}

        self.op_sub = rospy.Subscriber("operator_text", String,
                                       call_callbacks_in(self.on_operator_text,
                                                         lambda rosmsg: rosmsg.data),
                                       queue_size=100)
        self.robot_sub = rospy.Subscriber("robot_text", String,
                                          call_callbacks_in(self.on_robot_text, lambda rosmsg: rosmsg.data),
                                          queue_size=100)
        # fixme
        # self.title_sub = rospy.Subscriber("/title", self.callback, queue_size=100)

        self.step_sub = rospy.Subscriber("challenge_step", UInt32,
                                         call_callbacks_in(self.on_challenge_step,
                                                           lambda rosmsg: rosmsg.data),
                                         queue_size=100)

        self.story_sub = rospy.Subscriber("story", Story, call_callbacks_in(self.on_story, lambda rosmsg: (
            rosmsg.title, rosmsg.storyline)), queue_size=1)

        # Pass external argument while launching server.py to pass topics as a variable, like python2.7 ./server.py image:= usb_cam/image_raw
        '''
        /image_raw (published from PC)
        /roboBreizh_detector/perception
        /roboBreizh_detector/perception_kmeans
        /naoqi_driver/camera/front/image_raw
        '''
        self.image_sub = rospy.Subscriber("/image_raw", Image,
                                          call_callbacks_in(self.on_image,
                                                            self.ros_image_to_base64), queue_size=1)
        # self.compressed_image_sub = rospy.Subscriber("/output/image_raw/compressed", CompressedImage, call_callbacks_in(self.on_image, self.ros_image_to_base64), queue_size=1)

        # Commented this one out as i have already handled it in separate function
        # try:
        #     self.story_sub = rospy.Subscriber("story", Story, call_callbacks_in(self.on_story, lambda rosmsg: (
        #         rosmsg.title, rosmsg.storyline)), queue_size=100)
        # except NameError as e:
        #     rospy.logerr("To dynamically define a Story, catkin_make this package")

        self.cmd_pub = rospy.Publisher("command", String, queue_size=1)
        self.btn_pub = rospy.Publisher("next_step", String, queue_size=1)

        self._title = rospy.get_param("story/title", "Title")

        # Commented this one out <-- uncomment it and add your storylines here if you want the story line set statically onStart

        self._storyline = rospy.get_param("story/storyline", ["step1", "step2", "step3"])

    # self.storyline2 = rospy.Publisher("story", String, queue_size=1)

    def accept_command(self, command_text):
        self.cmd_pub.publish(command_text)

    def btn_pushed(self, command_text):
        self.btn_pub.publish(command_text)

    def ros_image_to_base64(self, rosmsg):
        if hasattr(rosmsg, 'encoding'):
            decoder = self.__encoding[rosmsg.encoding]
            # print(decoder(rosmsg))
        else:
            decoder = self.__encoding['compressed']
        return decoder(rosmsg)

    @staticmethod
    def rgba2base64(rosmsg):
        # print('rgba2base64')   # on robot
        length = len(rosmsg.data)
        bytes_needed = int(rosmsg.width * rosmsg.height * 3)
        # print "encode: length={} width={}, heigth={}, bytes_needed={}".format(length, width, height, bytes_needed)

        converted = pil_image.frombytes('RGB',
                                        (rosmsg.width, rosmsg.height),
                                        rosmsg.data)
        # string_buffer = StringIO()
        string_buffer = BytesIO()
        converted.save(string_buffer, format="png")
        image_bytes = string_buffer.getvalue()
        encoded = base64.standard_b64encode(image_bytes)
        return encoded

    @staticmethod
    def compressed2base64(rosmsg):
        print('compressed2base64')
        length = len(rosmsg.data)
        img_np_arr = np.fromstring(rosmsg.data, np.uint8)
        flag = cv2.IMREAD_COLOR if cv2.__version__.split('.')[0] == '3' else cv2.IMREAD_COLOR
        encoded_img = cv2.imdecode(img_np_arr, flag)[:, :, ::-1]
        converted = pil_image.fromarray(encoded_img)
        # string_buffer = StringIO()
        string_buffer = BytesIO()
        converted.save(string_buffer, format="png")
        image_bytes = string_buffer.getvalue()
        encoded = base64.standard_b64encode(image_bytes)
        return encoded

    @staticmethod
    def bgr8_2_base64(rosmsg):
        # print('bgr8_2_base64')   # on PC
        # Decode image into RGB rigt because PIL doesn't know BGR.
        # Below we simply reorder the channels
        converted_rgb = pil_image.frombytes('RGB',
                                            (rosmsg.width, rosmsg.height),
                                            rosmsg.data)

        # Re-order channels to match RGB what we encoded :-).
        b, g, r = converted_rgb.split()
        converted = pil_image.merge("RGB", (b, g, r))

        # string_buffer = StringIO()
        string_buffer = BytesIO()
        converted.save(string_buffer, format="png")
        image_bytes = string_buffer.getvalue()
        encoded = base64.standard_b64encode(image_bytes)
        return encoded
