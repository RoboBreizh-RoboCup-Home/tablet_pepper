var ros = new ROSLIB.Ros({
    url: 'ws://10.203.2.153:9090'
});
var is_detection_camera = false;
var detection_camera_data = null;
var pageTitle = 'Carry my Luggage';
var detection_camera = new ROSLIB.Topic({
    ros: ros,
    name: 'robobreizh/detection_camera',
    messageType: 'sensor_msgs/CompressedImage'
});
detection_camera.subscribe(function (message) {
    is_detection_camera = true;
    detection_camera_data = message.data;
});
window.onload = function () {
    var title = document.createElement('h1');
    var content_container = document.getElementById('content-container');
    title.innerHTML = "<h1>Camera is not connected</h1>";
    console.log('is_detection_camera', is_detection_camera);
    if (is_detection_camera) {
        var img = document.createElement('img');
        img.src = 'data:image/jpeg;base64,' + detection_camera_data;
        img.alt = 'detection_camera';
        img.style.width = '100%';
        img.style.height = '100%';
        title.innerHTML = "<h1>Camera is connected</h1>";
        if (content_container) {
            content_container.appendChild(title);
            content_container.appendChild(img);
        }
    }
    else {
        if (content_container) {
            content_container.appendChild(title);
        }
    }
};
