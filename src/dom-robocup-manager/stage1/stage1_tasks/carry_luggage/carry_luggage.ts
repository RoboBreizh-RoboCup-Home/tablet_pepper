var detection_camera_data = null;
var ros = new ROSLIB.Ros({
    // url: 'ws://192.168.50.44:9090'
    // url : 'ws://localhost:9090'
    url: 'ws://198.18.0.1:9090'
    // url: 'ws://127.0.0.1:9090'
    // url: 'ws://10.203.2.153:9090'
});
ros.on('connection', function () {
    content_initialize();
});

// listen to the topic robobreizh/detection_camera of message type sensor_msgs/Image
var detection_camera = new ROSLIB.Topic({
    ros: ros,
    name: '/naoqi_driver/camera/front/image_raw/compressed',
    messageType: 'sensor_msgs/CompressedImage'
});

// call the callback function upon receiving a message
detection_camera.subscribe(function (message) {
    detection_camera_data = message.data;
    image_update();
});

function content_initialize () {
    var content_container = document.getElementById('content-container');
    var title = document.getElementById('socket-status');
    title.innerHTML = "Websocket server connected";
    content_container.appendChild(title);

    var img = document.createElement('img');
    img.alt = 'detection camera image';
    img.style.width = '100%';
    img.style.height = '100%';
    img.id = 'detection-camera';
    content_container.appendChild(img);
}

function image_update() {
    var camera_status = document.getElementById('camera-status');
    camera_status.innerHTML = "Camera connected";
    update_src = 'data:image/jpeg;base64,' + detection_camera_data;
    document.getElementById('detection-camera').src = update_src;
}