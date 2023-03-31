var ros = new ROSLIB.Ros({
    url: 'ws://10.203.2.153:9090'
});
var content = document.getElementById("contentDiv");
var Demo = function ( /*send : any*/) {
    content.innerHTML = "\n    <h1>\n        Choose a demo\n    </h1>\n    <section class=\"button-container\">\n        <button id=\"chatgpt\" class=\"option-btn\">(Chat GPT)</button>\n        <button id=\"poseDetection\" class=\"option-btn\">Pose detection</button>\n        <button id=\"ageDetection\" class=\"option-btn\">Age detection</button>\n        <button id=\"relationshipDetection\" class=\"option-btn\">Relationships Detection</button>\n    </div>\n    ";
    var relationshipDetectionBtn = document.getElementById("chatgpt");
    relationshipDetectionBtn.addEventListener('click', function () {
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
        changePage(relationshipDetectionBtn.id);
    });
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
        var poseAction = new ROSLIB.ActionClient({
            ros: ros,
            serverName: '/Pose_Detector',
            actionName: 'perception_pepper/PoseDemoAction'
        });
        var goal = new ROSLIB.Goal({
            actionClient: poseAction,
            goalMessage: {
                max_duration: {
                    secs: 1000,
                    nsecs: 0
                }
            }
        });
        goal.send();
        changePage(poseDetectionBtn.id);
    });
    var ageDetectionBtn = document.getElementById("ageDetection");
    ageDetectionBtn.addEventListener('click', function () {
        var ageAction = new ROSLIB.ActionClient({
            ros: ros,
            serverName: '/face_demo',
            actionName: 'perception_pepper/FaceDemoAction'
        });
        var goal = new ROSLIB.Goal({
            actionClient: ageAction,
            goalMessage: {
                max_duration: {
                    secs: 1000,
                    nsecs: 0
                }
            }
        });
        goal.send();
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
        case 'relationshipDetection':
            ChatGpt();
            break;
        default:
            console.log("The page does not exist");
            break;
    }
};
var ChatGpt = function () {
    content.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"top-left-corner\" id=\"home-icon\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18\" />\n    </svg>\n\n    <h1>\n        Chat GPT\n    </h1>\n    <div class=\"button-container\">\n        <div id=\"loading\">\n            <p>Please ask a question...</p>\n            <div id=\"loader\" class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>\n        </div>\n        <div id=\"chat-wrapper\" class=\"chat-wrapper\">\n            <div id=\"request\">\n            </div>\n            <div id=\"answer\">\n            </div>\n        </div>\n    </div>\n    ";
    var request = new ROSLIB.Topic({
        ros: ros,
        name: '/roboBreizh_chat_demo/user_utterance',
        messageType: 'std_msgs/String'
    });
    request.subscribe(function (message) {
        var loader = document.getElementById("loading");
        loader.innerHTML = '';
        var chatWrapper = document.getElementById("chat-wrapper");
        chatWrapper.style.height = "100%";
        var requestDom = document.getElementById("request");
        requestDom.innerHTML = '<div class="request"> User : ' + message.data + '</div>';
    });
    var answer = new ROSLIB.Topic({
        ros: ros,
        name: '/roboBreizh_chat_demo/robot_utterance',
        messageType: 'std_msgs/String'
    });
    answer.subscribe(function (message) {
        var loader = document.getElementById("loading");
        loader.innerHTML = '';
        var chatWrapper = document.getElementById("chat-wrapper");
        chatWrapper.style.height = "100%";
        var answerDom = document.getElementById("answer");
        answerDom.innerHTML = '<div class="answer"> Pepper : ' + message.data + '</div>';
    });
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        answer.unsubscribe();
        request.unsubscribe();
        changePage('home');
    });
};
var PoseDetection = function () {
    content.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"top-left-corner\" id=\"home-icon\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18\" />\n    </svg>\n    <h1>\n        Pose detection\n    </h1>\n    <div id=\"pose-container\" class=\"button-container\">\n    </div>\n    ";
    var faceDetection = new ROSLIB.Topic({
        ros: ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name: '/roboBreizh_demo/demo_face_detection',
        messageType: 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe(function (message) {
        var container = document.getElementById("pose-container");
        container.innerHTML = "<img id=\"camera-image\" class=\"camera-view\" src=\"data:image/jpg;base64,".concat(message.data, "\">");
    });
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        changePage('home');
    });
};
var RelationDetection = function () {
    content.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"top-left-corner\" id=\"home-icon\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18\" />\n    </svg>\n    <h1>\n        Relationships Detection\n    </h1>\n    <div id=\"pose-container\" class=\"button-container\">\n    </div>\n    ";
    var faceDetection = new ROSLIB.Topic({
        ros: ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name: '/roboBreizh_demo/demo_face_detection',
        messageType: 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe(function (message) {
        var container = document.getElementById("pose-container");
        container.innerHTML = "<img id=\"camera-image\" class=\"camera-view\" src=\"data:image/jpg;base64,".concat(message.data, "\">");
    });
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        changePage('home');
    });
};
var AgeDetection = function () {
    content.innerHTML = "\n    <svg xmlns=\"http://www.w3.org/2000/svg\" fill=\"none\" viewBox=\"0 0 24 24\" stroke-width=\"1.5\" stroke=\"currentColor\" class=\"top-left-corner\" id=\"home-icon\">\n        <path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18\" />\n    </svg>\n    <h1>\n        Age detection\n    </h1>\n    <div id=\"pose-container\" class=\"button-container\">\n        <div id=\"loading\">\n            <div id=\"loader\" class=\"lds-roller\"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>\n        </div>\n    </div>\n    ";
    var faceDetection = new ROSLIB.Topic({
        ros: ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name: '/roboBreizh_demo/demo_face_detection',
        messageType: 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe(function (message) {
        var container = document.getElementById("pose-container");
        container.innerHTML = "<img id=\"camera-image\" class=\"camera-view\" src=\"data:image/jpg;base64,".concat(message.data, "\">");
    });
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        faceDetection.unsubscribe();
        changePage('home');
    });
};
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
