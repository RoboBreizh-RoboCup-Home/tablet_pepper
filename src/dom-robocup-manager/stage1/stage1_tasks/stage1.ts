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

detection_camera.subscribe(function(message) {
    update_image(message.data);
});

operator_text.subscribe(function(message) {
    update_text(camel_case_to_sentence_case(String(message.data)), "operator_text");
});

robot_text.subscribe(function(message) {
    update_text(camel_case_to_sentence_case(String(message.data)), "robot_text");
});

current_task_listener.subscribe(function(message) {
    if (String(message.data).slice(-6) == ".exec;") {
        update_task(camel_case_to_sentence_case(String(message.data).slice(0, -6)));
    }
});

ros.on('connection', function() {
    ready_to_display(function() {});
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
    setTimeout(function() {
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
    var start_task = document.getElementsByTagName('title')[0].innerHTML;
    var start_button_message = new ROSLIB.Message({
        data: String(start_task)
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
function update_image(new_image) {
    document.getElementById('detection-camera').src = 'data:image/jpeg;base64,' + String(new_image);
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

function update_task(new_task) {
    var task = document.getElementById('task-items');
    if ((task.children.length > 0) && (task.children[task.children.length - 1].innerHTML == new_task)) {
        return;
    }
    var new_task_item = document.createElement('li');
    new_task_item.innerHTML = new_task;
    task.appendChild(new_task_item);
    var children = task.children;
    while (children.length > 3) {
        task.removeChild(children[0]);
    }
    for (var i = 0; i < children.length; i++) {
        children[i].style.textDecoration = "none";
    }
    children[children.length - 1].style.textDecoration = "underline";
}

function clean_subscription() {
    detection_camera.unsubscribe();
    operator_text.unsubscribe();
    robot_text.unsubscribe();
    current_task_listener.unsubscribe();
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

function camel_case_to_sentence_case(text) {
    var sentence = text.replace(/([A-Z])/g, ' $1').toLowerCase().substr(1).replace('_', ' ');
    
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}