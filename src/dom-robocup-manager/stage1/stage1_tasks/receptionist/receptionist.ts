var ros = new ROSLIB.Ros({
    url: 'ws://192.168.50.44:9090'
});
var detection_camera = new ROSLIB.Topic({
    ros: ros,
    name: '/naoqi_driver/camera/front/image_raw/compressed',
    messageType: 'sensor_msgs/CompressedImage'
});
var operator_text = new ROSLIB.Topic({
    ros: ros,
    name: '/operator_text',
    messageType: 'std_msgs/String'
});
var robot_text = new ROSLIB.Topic({
    ros: ros,
    name: '/robot_text',
    messageType: 'std_msgs/String'
});
var current_task_listener = new ROSLIB.Topic({ // /pnp/currentActivePlaces
    ros: ros,
    name: '/pnp/currentActivePlaces',
    messageType: 'std_msgs/String'
});
detection_camera.subscribe(function (message) {
    update_image(message.data);
});
operator_text.subscribe(function (message) {
    update_text(String(message.data), "operator_text");
});
robot_text.subscribe(function (message) {
    update_text(String(message.data), "robot_text");
});
current_task_listener.subscribe(function (message) {
    // call update_task on change
    if (String(message.data) != "f") {
        update_task(String(message.data));
    }
});
var initial_html;
window.onload = function () {
    initial_html = document.getElementsByTagName('html')[0];
};
ros.on('connection', function () {
    ready_to_display(function () {});
});
function ready_to_display(callback) {
    var start_button = document.getElementById('start-button');
    start_button.disabled = true;
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
function update_text(new_text, source) {
    var convo = document.getElementById('convo');
    var new_convo = document.createElement('li');
    new_convo.classList.add(source);
    new_convo.innerHTML = new_text;
    convo.appendChild(new_convo);
    // show only the last 5 messages
    var children = convo.children;
    while (children.length > 5) {
        convo.removeChild(children[0]);
    }
}
function update_image(new_image) {
    document.getElementById('detection-camera').src = 'data:image/jpeg;base64,' + String(new_image);
}
function update_task(new_task) {
    var task = document.getElementById('current-task');
    task.innerHTML = new_task;
}
function clean_subscription() {
    detection_camera.unsubscribe();
    robot_text.unsubscribe();
    operator_text.unsubscribe();
}
function initialize() 
{
    var html = document.getElementsByTagName('html')[0];
    html.innerHTML = initial_html.innerHTML;
}