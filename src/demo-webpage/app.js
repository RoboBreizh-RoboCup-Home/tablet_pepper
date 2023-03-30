var ros = new ROSLIB.Ros({
    url: 'ws://10.203.3.61:9090'
});

var content = document.getElementById("contentDiv");
var Demo = function ( /*send : any*/) {
    content_HTML = `
    <h1>Choose a demo</h1>
    <section class="button-container">
        <button id="chatgpt" class="option-btn">(Chat GPT)</button>
        <button id="poseDetection" class="option-btn">Pose detection</button>
        <button id="ageDetection" class="option-btn">Age detection</button>
    </section>`;
    content.innerHTML = content_HTML;
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
    const ChatGpt_HTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    <h1>
        Chat GPT
    </h1>
    <div class="button-container">
        <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div id="request">
            <div class="request">
                User: dummy
            </div>
        </div>
        <div id="answer">
            <div class="answer">
                User: dummy
            </div>
        </div>
    </div>`;
    content.innerHTML = ChatGpt_HTML;
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
        answer.unsubscribe();
        request.unsubscribe();
        changePage('home');
    });
};

var PoseDetection = function () {
    PoseDetection_HTML = `
    <svg xmlns="http://www.w3.org/2000/svg" 
    fill="none" viewBox="0 0 24 24" 
    stroke-width="1.5" 
    stroke="currentColor" 
    class="top-left-corner" 
    id="home-icon">

        <path stroke-linecap="round"
              stroke-linejoin="round" 
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    
    </svg>

    <h1>
        Pose detection
    </h1>
    
    <div class="button-container">
        <div class="lds-roller">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
        <div id="request">
            <div class="request">
                User: dummy
            </div>
        </div>
        <div id="answer">
            <div class="answer">
                User: dummy
            </div>
        </div>
    </div>`;
    content.innerHTML = PoseDetection_HTML;
    var homeIcon = document.getElementById("home-icon");
    homeIcon.addEventListener('click', function () {
        changePage('home');
    });
};

var AgeDetection = function () {
    AgeDetection_HTML = `
    <svg xmlns="http://www.w3.org/2000/svg" 
     fill="none" 
     viewBox="0 0 24 24" 
     stroke-width="1.5" 
     stroke="currentColor" 
     class="top-left-corner" 
     id="home-icon">

        <path stroke-linecap="round" 
            stroke-linejoin="round" 
            d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    
    </svg>
    <h1>Age detection</h1>
    <img id="camera-image" src="">`;
    content.innerHTML = AgeDetection_HTML;

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
