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
var current_task_listener = new ROSLIB.Topic({
    ros: ros,
    name: '/pnp/currentActivePlaces',
    messageType: 'std_msgs/String'
});
detection_camera.subscribe(function (message) {
    update_image(message.data);
});
operator_text.subscribe(function (message) {
    update_text(camel_case_to_sentence_case(String(message.data)), "operator_text");
});
robot_text.subscribe(function (message) {
    update_text(camel_case_to_sentence_case(String(message.data)), "robot_text");
});
current_task_listener.subscribe(function (message) {
    if (String(message.data).slice(-6) == ".exec;") {
        update_task(camel_case_to_sentence_case(String(message.data).slice(0, -6)));
    }
});
ros.on('connection', function () {
    ready_to_display(function () { });
});
ros.on('error', function (error) {
    // console.log(error);
    unsubscribe();
});
ros.on('close', function () {
    unsubscribe();
});
function ready_to_display(callback) {
    start_button_click();
    var start_button = document.getElementById('start-button');
    start_button.disabled = true;
    var line = document.getElementsByClassName('line');
    line[0].style.display = "inline";
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
    var buttons = document.getElementsByClassName('on-connect');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "inline";
    }
}
function start_button_click() {
    initialize();
    var start_button = document.getElementById('start-button');
    start_button.disabled = true;
    var stop_button = document.getElementById('stop-button');
    stop_button.disabled = false;
    var start_button_publisher = new ROSLIB.Topic({
        ros: ros,
        name: '/pnp/planToExec',
        messageType: 'std_msgs/String'
    });
    var message = document.getElementById('title').innerHTML;
    var start_message = new ROSLIB.Message({
        data: message
    });
    start_button_publisher.publish(start_message);
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
function emphasize_new_update(id) {
    var element = document.getElementById(id);
    for (var i = 0; i < element.children.length; i++) {
        element.children[i].style.textDecoration = "none";
        element.children[i].style.fontWeight = "normal";
        element.children[i].style.listStyleType = "circle";
    }
    if (element.children.length > 0) {
        element.children[element.children.length - 1].style.textDecoration = "underline";
        element.children[element.children.length - 1].style.fontWeight = "bold";
        element.children[element.children.length - 1].style.listStyleType = "disc";
    }
}
function camel_case_to_sentence_case(text) {
    var sentence = text.replace(/([A-Z])/g, ' $1').toLowerCase().replace('_', ' ');
    if (sentence.charAt(0) == ' ') {
        sentence = sentence.substr(1);
    }
    // if pattern "g p s r" or "e g p s r" is detected in the sentence, replace with "GPSR" or "EGPSR"
    if (sentence.indexOf("g p s r") != -1) {
        sentence = sentence.replace("g p s r", "GPSR");
    }
    if (sentence.indexOf("e g p s r") != -1) {
        sentence = sentence.replace("e g p s r", "EGPSR");
    }
    sentence = sentence.replace(" i ", " I ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
function resize_image(img) {
    // resize image to 14:10 ratio
    var ratio = 12 / 11;
    var width = img.width;
    var height = img.height;
    if (width / height > ratio) {
        img.width = height * ratio;
    }
    else {
        img.height = width / ratio;
    }
}
function update_image(new_image) {
    var image = document.getElementById('detection-camera');
    image.src = 'data:image/jpeg;base64,' + String(new_image);
    resize_image(image);
}
function update_text(new_text, source) {
    var convo = document.getElementById('convo');
    var new_convo = document.createElement('li');
    var children = convo.children;
    new_convo.classList.add(String(source));
    new_convo.innerHTML = new_text;
    convo.appendChild(new_convo);
    while (children.length > 3) {
        convo.removeChild(children[0]);
    }
    convo.scrollTop = convo.scrollHeight;
}
function update_task(new_task) {
    var task = document.getElementById('task-items');
    if ((task.children.length > 0) && (task.children[task.children.length - 1].innerHTML == new_task)) {
        return;
    }
    var new_task_item = document.createElement('li');
    new_task_item.innerHTML = new_task;
    var children = task.children;
    task.appendChild(new_task_item);
    while (children.length > 3) {
        task.removeChild(children[0]);
    }
    task.scrollTop = task.scrollHeight;
    emphasize_new_update('task-items');
}
function unsubscribe() {
    if (detection_camera) {
        detection_camera.unsubscribe();
    }
    if (operator_text) {
        operator_text.unsubscribe();
    }
    if (robot_text) {
        robot_text.unsubscribe();
    }
    if (current_task_listener) {
        current_task_listener.unsubscribe();
    }
    detection_camera = null;
    operator_text = null;
    robot_text = null;
    current_task_listener = null;
}
function initialize() {
    var task_items = document.getElementById('task-items');
    task_items.innerHTML = "";
    var convo = document.getElementById('convo');
    convo.innerHTML = "";
}
