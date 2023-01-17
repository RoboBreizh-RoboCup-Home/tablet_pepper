import * as ROSLIB from 'roslib';


let ros = new ROSLIB.Ros({
    url : 'ws://192.168.50.44:9090'
    // url: '198.18.0.1:9090'
});
 
// Pepper screen size: width: 1280 height: 800
// But image scaling fucks everything up

// this acts as a router and a websocket client
// class Server {
//     /*
//     * Websocket
//     */
//     public websocket!: WebSocket;
//     public websocket_url!: string;

//     constructor(websocket_url: string) {
//         this.websocket_url = websocket_url;
//         this.websocket = new WebSocket(websocket_url);
//     }    

//     public send = (message: string, controller : Controller) => {
//         this.websocket.send(JSON.stringify(message));
//         let btnId = JSON.parse(message);
//         switch (btnId.id) {
//             case 'chatgpt': {
//                 ChatGpt(this.send);
//                 break;
//             }
//             case 'poseDetection': {
//                 PoseDetection(this.send);
//                 break;
//             }
//             case 'ageDetection': {
//                 AgeDetection(this.send);
//                 break;
//             }
//         }
            
//     }

//     /* Externals */
//     listener(controller: Controller) {
//         this.websocket.addEventListener('message', event => {
//             console.log(event.data);
//             let message = JSON.parse(event.data);
//             console.log(message);
            
//             if ('type' in message) {
//                 switch(message.type) {
//                     case 'demo': {
//                         if ('textContent' in message) 
//                             Demo(this.send);
//                         break;
//                     }
//                 }
//             }
//         });
//     }
// }

let content: HTMLDivElement = (document.getElementById("contentDiv")! as HTMLDivElement);

const Demo= (/*send : any*/): void => {
    content.innerHTML = `
    <h1>
        Choose a demo
    </h1>
    <section class="button-container">
        <button id="chatgpt" class="option-btn">(Chat GPT)</button>
        <button id="poseDetection" class="option-btn">Pose detection</button>
        <button id="ageDetection" class="option-btn">Age detection</button>
    </div>
    `;

    let btns : NodeListOf<HTMLButtonElement> = document.querySelectorAll(".option-btn") as NodeListOf<HTMLButtonElement>;
    btns.forEach((btn) => {
        btn.addEventListener('click', () => {

            changePage(btn.id);
            // let message = {
            //     "id": btn.id,
            // };

            // send(JSON.stringify(message));
        })
    });
}

const changePage = (page: string) => {
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
}

const ChatGpt= (): void => {
    content.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>

    <h1>
        Chat GPT
    </h1>
    <div class="button-container">
        <div id="request"> </div>
        <div id="answer"></div>
    </div>
    `;
    let request = new ROSLIB.Topic({
        ros : ros,
        name : '/roboBreizh_chat_demo/user_utterance',
        messageType : 'std_msgs/String'
    });
    request.subscribe((message: any) => {
        let img : HTMLDivElement = document.getElementById("request") as HTMLDivElement;
        img.innerHTML = '<p>' + message.data + '</p>';
    });

    let answer = new ROSLIB.Topic({
        ros : ros,
        name : '/roboBreizh_chat_demo/robot_utterance',
        messageType : 'std_msgs/String'
    });

    answer.subscribe((message: any) => {
        let img : HTMLDivElement = document.getElementById("answer") as HTMLDivElement;
        img.innerHTML = '<p>' + message.data + '</p>';
    });

    let homeIcon = document.getElementById("home-icon")!;
    homeIcon.addEventListener('click', () => {
        request.unsubscribe();
        changePage('home');        
    });
};

const PoseDetection = (): void =>{
    content.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    <h1>
        Pose detection
    </h1>
    <div class="button-container">

    </div>
    `;
    let homeIcon = document.getElementById("home-icon")!;
    homeIcon.addEventListener('click', () => {
        changePage('home');        
    });
}

const AgeDetection  = (): void => {
    content.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="top-left-corner" id="home-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
    <h1>
        Age detection
    </h1>
    <img id="camera-image" src="">
    `;

    let faceDetection = new ROSLIB.Topic({
        ros : ros,
        // name : "/naoqi_driver/camera/front/image_raw/compressed",
        name : '/roboBreizh_demo/demo_face_detection',
        messageType : 'sensor_msgs/CompressedImage'
    });
    faceDetection.subscribe((message: any) => {
        let img : any= document.getElementById("camera-image");
        img.src = 'data:image/jpg;base64,' + message.data;
    });
    let homeIcon = document.getElementById("home-icon")!;
    homeIcon.addEventListener('click', () => {
        faceDetection.unsubscribe();
        changePage('home');        
    });
}
// Pages
// server: Server;

    // this.server = new Server(address);
    // this.server.listener(this);
    // const ws = new Server(address, this);

    // Load at startup
    // Demo(this.server.send);
    // this.loadingSite.update("Loading internal webpage...")
    // this.server.listener(this);

window.onload = function() {
    // const ws = new Server('ws://localhost:8080');
    ros.on('connection', () => {
        console.log('Connected to websocket server.');
    });
    ros.on('error', (error) => {
        console.log('Error connecting to websocket server: ', error);
    });
    ros.on('close', () => {
        console.log('Connection to websocket server closed.');
    });

    Demo();
};