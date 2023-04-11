var ros = new ROSLIB.Ros({
    url: 'ws://192.168.50.44:9090'
});
var detection_camera = new ROSLIB.Topic({
    ros: ros,
    name: '/naoqi_driver/camera/front/image_raw/compressed',
    messageType: 'sensor_msgs/CompressedImage'
});
detection_camera.subscribe(function (message) {
    detection_camera_data = message.data;
    image_update();
});
ros.on('connection', function () {
    ready_to_display(function () {});
});
function ready_to_display(callback) {
    var start_button = document.getElementById('start-button');
    start_button.disabled = true;
    var guest_name = document.getElementById('guest-name');
    guest_name.style.display = "inline";
    var fav_drink = document.getElementById('fav-drink');
    fav_drink.style.display = "inline";
    var buttons = document.getElementsByClassName('switch-buttons');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "inline";
    }
    var text_prompts = document.getElementsByClassName('to-be-cleared');
    for (var i = 0; i < text_prompts.length; i++) {
        text_prompts[i].innerHTML = text_prompts[i].innerHTML.replace("disconnected", "✅");
    }
    setTimeout(function () {
        var text_prompts = document.getElementsByClassName('to-be-cleared');
        for (var i = 0; i < text_prompts.length; i++) {
            text_prompts[i].innerHTML = "";
        }
        callback();
    }, 1000);
    var image = document.getElementById('detection-camera');
    image.style.display = "inline";
}
function start_button_click() {
    var start_button = document.getElementById('start-button');
    start_button.disabled = true;
    var stop_button = document.getElementById('stop-button');
    stop_button.disabled = false;
    var start_button_publisher = new ROSLIB.Topic({
        ros: ros,
        name: '/pnp/planToExec',
        messageType: 'std_msgs/String'
    });
    var start_button_message = new ROSLIB.Message({
        data: 'Receptionist'
    });
    start_button_publisher.publish(start_button_message);
}
function stop_button_click() {
    var stop_button = document.getElementById('stop-button');
    stop_button.disabled = true;
    var start_button = document.getElementById('start-button');
    start_button.disabled = false;
    var stop_button_publisher = new ROSLIB.Topic({
        ros: ros,
        name: '/pnp/planToExec',
        messageType: 'std_msgs/String'
    });
    var stop_button_message = new ROSLIB.Message({
        data: 'stop'
    });
    stop_button_publisher.publish(stop_button_message);
}
var detection_camera_data = "";
function image_update() {
    document.getElementById('detection-camera').src = 'data:image/jpeg;base64,' + detection_camera_data;
}
function clean_subscription() {
    detection_camera.unsubscribe();
    current_task_listener.unsubscribe();
}