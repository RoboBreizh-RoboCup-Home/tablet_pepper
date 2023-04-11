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
    detection_camera_data = message.data;
    image_update();
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
ros.on('connection', function () {
    ready_to_display(function () { });
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
        z;
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
    initialize();
    ready_to_display(function () { });
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
        data: 'CarryMyLuggage'
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
    var task = document.getElementById('currendt-task');
    task.innerHTML = new_task;
}
function clean_subscription() {
    detection_camera.unsubscribe();
    operator_text.unsubscribe();
    robot_text.unsubscribe();
    current_task_listener.unsubscribe();
}
function initialize() {
    var html = document.getElementsByTagName('html')[0];
    html.innerHTML = "\n    <head>\n        <meta charset=\"UTF-8\" />\n        <!-- icon -->\n        <link rel=\"icon\" href=\"../../../static/favicon.png\">\n    \n        <!-- bootstrap -->\n        <link rel=\"stylesheet\" href=\"../../../bootstrap/css/bootstrap.min.css\" />\n        <link rel=\"stylesheet\" href=\"../../../bootstrap/css/bootstrap-grid.min.css\" />\n    \n        <link rel=\"stylesheet\" href=\"../../../css/style.css\" />\n        <script src=\"../../../roslib.min.js\" defer></script>\n        <script src=\"./receptionist.js\" defer></script>\n    \n        <title>Robocup Manager</title>\n    </head>\n    <body>\n        <div class=\"row text-center header\">\n            <!-- header row with two elements side by side-->\n            <div class=\"col-sm-2 header-left header-yellow font-bold\">\n                <h1 onclick=\"location.href='../../../index.html'; clean_subscription();\">Home</h1>\n            </div>\n            <div class=\"col-sm-9 header-left header-violet font-bold\">\n                <h1>Receptionist</h1>\n            </div>\n            <div class=\"col-sm-1  header-blue\">\n                <svg viewBox=\"0 0 32 32\" fill=\"currentColor\" xmlns=\"http://www.w3.org/2000/svg\" width=\"48px\" height=\"48px\">\n                    <path d=\"M19 10H26V12H19zM19 15H26V17H19zM19 20H26V22H19z\"></path>\n                    <path d=\"M28,5H4A2.002,2.002,0,0,0,2,7V25a2.0023,2.0023,0,0,0,2,2H28a2.0027,2.0027,0,0,0,2-2V7A2.0023,2.0023,0,0,0,28,5ZM4,7H15V25H4ZM17,25V7H28l.002,18Z\"></path>\n                </svg>\n            </div>\n        </div>\n        <div id=\"content-container\">\n            <div id=\"camera-status\" class=\"to-be-cleared\">Camera disconnected</div>\n            <div id=\"socket-status\" class=\"to-be-cleared\">Websocket disconnected</div>\n            <div class=\"row\">\n                <div class=\"col-sm-8\">\n                    <img src=\"\" id=\"detection-camera\" class=\"animed_image\" style=\"display: none;\">\n                </div>\n                <div class=\"col-sm-4\">\n                    <p><h2 id=\"guest-name\" style=\"display: none;\">Hello </h2></p>\n                    <p><h3 id=\"fav-drink\" style=\"display: none;\">Now serving: </h3></p>\n                    <div class=\"button-container\">\n                        <button id=\"start-button\" class=\"btn btn-primary btn-lg switch-buttons\" style=\"display: none;\" onclick=\"start_button_click()\">Start</button>\n                        <button id=\"stop-button\" class=\"btn btn-danger btn-lg switch-buttons\" style=\"display: none;\" onclick=\"stop_button_click()\">Stop</button>\n                    </div>\n                </div>\n            </div>\n        </div>\n    </body>\n    ";
}
