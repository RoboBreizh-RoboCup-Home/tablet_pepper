var ros = new ROSLIB.Ros({
    url: 'ws://198.18.0.1:9090'
});
var content = document.getElementById("contentDiv");
var Demo = function ( /*send : any*/) {
    content.innerHTML = "\n    <h1>\n        Choose a demo\n    </h1>\n    <section class=\"button-container\">\n        <button id=\"chatgpt\" class=\"option-btn\">(Chat GPT)</button>\n        <button id=\"poseDetection\" class=\"option-btn\">Pose detection</button>\n        <button id=\"ageDetection\" class=\"option-btn\">Age detection</button>\n    </div>\n    ";
    // let btns : NodeListOf<HTMLButtonElement> = document.querySelectorAll(".option-btn") as NodeListOf<HTMLButtonElement>;
    // btns.forEach((btn) => {
    var chatGptBtn = document.getElementById("chatgpt");
    chatGptBtn.addEventListener('click', function () {
        var gptAction = new ROSLIB.ActionClient({
            ros: ros,
            serverName: '/chat_demo_node',
            actionName: 'perception_pepper/ChatDemoAction'
        });
        var goal = new ROSLIB.Goal({
            actionClient: gptAction,
            goalMessage: {
                max_duration: {
                    secs: 1000,
                    nsecs: 0
                }
            }
        });
        goal.send();
        changePage(chatGptBtn.id);
    });
    var poseDetectionBtn = document.getElementById("poseDetection");
    poseDetectionBtn.addEventListener('click', function () {
        changePage(poseDetectionBtn.id);
    });
    var ageDetectionBtn = document.getElementById("ageDetection");
    ageDetectionBtn.addEventListener('click', function () {
        changePage(ageDetectionBtn.id);
    });
};
var changePage = function (page) {
    switch (page) {
        case 'home':
            Demo();
            break;
        case 'poseDetection':
            PoseDetection();
            break;
        case 'ageDetection':
            AgeDetection();
            break;
        case 'chatgpt':
            ChatGpt();
            break;
        default:
            console.log("The page does not exist");
            break;
    }
};
var ChatGpt = function () {
    content.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"top-left-corner\" id=\"home-icon\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18\" />\n    </svg>\n\n    <h1>\n        Chat GPT\n    </h1>\n    <div class=\"button-container\">\n        <div id=\"request\">\n            <div class=\"request\"> User : dummy </div>\n        </div>\n        <div id=\"answer\">\n            <div class=\"answer\"> User : dummy </div>\n        </div>\n    </div>\n    ";
    var request = new ROSLIB.Topic({
        ros: ros,
        name: '/roboBreizh_chat_demo/user_utterance',
        messageType: 'std_msgs/String'
    });
    request.subscribe(function (message) {
        var img = document.getElementById("request");
        img.innerHTML = '<div class="request"> User : ' + message.data + '</div>';
    });
    var answer = new ROSLIB.Topic({
        ros: ros,
        name: '/roboBreizh_chat_demo/robot_utterance',
        messageType: 'std_msgs/String'
    });
    answer.subscribe(function (message) {
        var img = document.getElementById("answer");
        img.innerHTML = '<div class="answer"> Pepper : ' + message.data + '</div>';
    });
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        // request.unsubscribe();
        changePage('home');
    });
};
var PoseDetection = function () {
    content.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"top-left-corner\" id=\"home-icon\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18\" />\n    </svg>\n    <h1>\n        Pose detection\n    </h1>\n    <div class=\"button-container\">\n\n    </div>\n    ";
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        changePage('home');
    });
};
var AgeDetection = function () {
    content.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"top-left-corner\" id=\"home-icon\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18\" />\n    </svg>\n    <h1>\n        Age detection\n    </h1>\n    <img id=\"camera-image\" src=\"\">\n    ";
    var faceDetection = new ROSLIB.Topic({
        ros: ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name: '/roboBreizh_demo/demo_face_detection',
        messageType: 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe(function (message) {
        var img = document.getElementById("camera-image");
        img.src = 'data:image/jpg;base64,' + message.data;
    });
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        faceDetection.unsubscribe();
        changePage('home');
    });
};
// Pages
// server: Server;
// this.server = new Server(address);
// this.server.listener(this);
// const ws = new Server(address, this);
// Load at startup
// Demo(this.server.send);
// this.loadingSite.update("Loading internal webpage...")
// this.server.listener(this);
window.onload = function () {
    // const ws = new Server('ws://198.18.0.1:9090');
    Demo();
    ros.on('connection', function () {
        console.log('Connected to websocket server.');
    });
    ros.on('error', function (error) {
        console.log('Error connecting to websocket server: ', error);
    });
    ros.on('close', function () {
        console.log('Connection to websocket server closed.');
    });
};
