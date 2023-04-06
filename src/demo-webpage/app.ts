let ros = new ROSLIB.Ros({
    // url : 'ws://10.203.2.153:9090',
    // url : 'ws://192.168.50.44:9090',
    url: 'ws://198.18.0.1:9090'
});

let content: HTMLDivElement = (document.getElementById("contentDiv")! as HTMLDivElement);

const Demo= (/*send : any*/): void => {
    /**
     * Entry point of the webpage
     */
    content.innerHTML = `
    <h1>
        Choose a demo
    </h1>
    <section class="button-container">
        <button id="chatgpt" class="option-btn">(Chat GPT)</button>
        <button id="poseDetection" class="option-btn">Pose detection</button>
        <button id="ageDetection" class="option-btn">Age detection</button>
        <button id="relationshipDetection" class="option-btn">Relationships Detection</button>
    </div>
    `;

    let relationshipDetectionBtn= document.getElementById("chatgpt")! as HTMLButtonElement;
    relationshipDetectionBtn.addEventListener('click', () => {
        let gptAction = new ROSLIB.ActionClient({
            ros : ros,
            serverName : '/chat_demo_node',
            actionName : 'perception_pepper/ChatDemoAction'
        });

        let goal = new ROSLIB.Goal({
            actionClient : gptAction,
            goalMessage : {
                max_duration:{
                    secs: 1000,
                    nsecs: 0
                }
            }
        });

        goal.send();

        changePage(relationshipDetectionBtn.id);
    });

    let chatGptBtn = document.getElementById("chatgpt")! as HTMLButtonElement;
    chatGptBtn.addEventListener('click', () => {
        let gptAction = new ROSLIB.ActionClient({
            ros : ros,
            serverName : '/chat_demo_node',
            actionName : 'perception_pepper/ChatDemoAction'
        });

        let goal = new ROSLIB.Goal({
            actionClient : gptAction,
            goalMessage : {
                max_duration:{
                    secs: 1000,
                    nsecs: 0
                }
            }
        });

        goal.send();

        changePage(chatGptBtn.id);
    });

    let poseDetectionBtn = document.getElementById("poseDetection")! as HTMLButtonElement;
    poseDetectionBtn.addEventListener('click', () => {
        let poseAction = new ROSLIB.ActionClient({
            ros : ros,
            serverName : '/Pose_Detector',
            actionName : 'perception_pepper/PoseDemoAction'
        });

        let goal = new ROSLIB.Goal({
            actionClient : poseAction,
            goalMessage : {
                max_duration:{
                    secs: 1000,
                    nsecs: 0
                }
            }
        });

        goal.send();

        changePage(poseDetectionBtn.id);
    });

    let ageDetectionBtn = document.getElementById("ageDetection")! as HTMLButtonElement;
    ageDetectionBtn.addEventListener('click', () => {
        let ageAction = new ROSLIB.ActionClient({
            ros : ros,
            serverName : '/face_demo',
            actionName : 'perception_pepper/FaceDemoAction'
        });

        let goal = new ROSLIB.Goal({
            actionClient : ageAction,
            goalMessage : {
                max_duration:{
                    secs: 1000,
                    nsecs: 0
                }
            }
        });

        goal.send();

        changePage(ageDetectionBtn.id);
    });

}

const changePage = (page: string) => {
    /** 
     * Change Page function
     * @param page : the page to load
     */
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
}

const ChatGpt= (): void => {
    /**
     * Load the chatgpt page
     */
    content.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>

    <h1>
        Chat GPT
    </h1>
    <div class="button-container">
        <div id="loading">
            <p>Please ask a question...</p>
            <div id="loader" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
        <div id="chat-wrapper" class="chat-wrapper">
            <div id="request">
            </div>
            <div id="answer">
            </div>
        </div>
    </div>
    `;
    let request = new ROSLIB.Topic({
        ros : ros,
        name : '/roboBreizh_chat_demo/user_utterance',
        messageType : 'std_msgs/String'
    });
    request.subscribe((message: any) => {
        let loader: HTMLDivElement = document.getElementById("loading") as HTMLDivElement;
        loader.innerHTML = '';
        let chatWrapper : HTMLDivElement = document.getElementById("chat-wrapper") as HTMLDivElement;
        chatWrapper.style.height = "100%";
        let requestDom: HTMLDivElement = document.getElementById("request") as HTMLDivElement;
        requestDom.innerHTML = '<div class="request"> User : ' + message.data + '</div>';
    });

    let answer = new ROSLIB.Topic({
        ros : ros,
        name : '/roboBreizh_chat_demo/robot_utterance',
        messageType : 'std_msgs/String'
    });

    answer.subscribe((message: any) => {
        let loader: HTMLDivElement = document.getElementById("loading") as HTMLDivElement;
        loader.innerHTML = '';
        let chatWrapper : HTMLDivElement = document.getElementById("chat-wrapper") as HTMLDivElement;
        chatWrapper.style.height = "100%";
        let answerDom: HTMLDivElement = document.getElementById("answer") as HTMLDivElement;
        answerDom.innerHTML = '<div class="answer"> Pepper : ' + message.data + '</div>';
    });

    let homeIcon = document.getElementById("home-icon")!;
    homeIcon.addEventListener('click', () => {
        answer.unsubscribe();
        request.unsubscribe();
        changePage('home');        
    });
};

const PoseDetection = (): void =>{
    /**
     * Load Pose Detection page
     */
    content.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    <h1>
        Pose detection
    </h1>
    <div id="pose-container" class="button-container">
    </div>
    `;

    let faceDetection = new ROSLIB.Topic({
        ros : ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name : '/roboBreizh_demo/demo_face_detection',
        messageType : 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe((message: any) => {
        let container: any = document.getElementById("pose-container");
        container.innerHTML = `<img id="camera-image" class="camera-view" src="data:image/jpg;base64,${message.data}">`;
    });

    let homeIcon = document.getElementById("home-icon")!;
    homeIcon.addEventListener('click', () => {
        changePage('home');        
    });
}
const RelationDetection = (): void =>{
    /**
     * Load relation detection page
     */
    content.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    <h1>
        Relationships Detection
    </h1>
    <div id="pose-container" class="button-container">
    </div>
    `;

    let faceDetection = new ROSLIB.Topic({
        ros : ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name : '/roboBreizh_demo/demo_face_detection',
        messageType : 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe((message: any) => {
        let container: any = document.getElementById("pose-container");
        container.innerHTML = `<img id="camera-image" class="camera-view" src="data:image/jpg;base64,${message.data}">`;
    });

    let homeIcon = document.getElementById("home-icon")!;
    homeIcon.addEventListener('click', () => {
        changePage('home');        
    });
}
const AgeDetection  = (): void => {
    /**
     * Load Age detection page
     */
    content.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    <h1>
        Age detection
    </h1>
    <div id="pose-container" class="button-container">
        <div id="loading">
            <div id="loader" class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </div>
    </div>
    `;

    let faceDetection = new ROSLIB.Topic({
        ros : ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name : '/roboBreizh_demo/demo_face_detection',
        messageType : 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe((message: any) => {
        let container: any = document.getElementById("pose-container");
        container.innerHTML = `<img id="camera-image" class="camera-view" src="data:image/jpg;base64,${message.data}">`;
    });
    let homeIcon = document.getElementById("home-icon")!;
    homeIcon.addEventListener('click', () => {
        faceDetection.unsubscribe();
        changePage('home');        
    });
}

window.onload = function() {
    // const ws = new Server('ws://198.18.0.1:9090');
    Demo();
    
    ros.on('connection', () => {
        console.log('Connected to websocket server.');
    });
    ros.on('error', (error:any) => {
        console.log('Error connecting to websocket server: ', error);
    });
    ros.on('close', () => {
        console.log('Connection to websocket server closed.');
    });
};