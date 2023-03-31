
let ros = new ROSLIB.Ros({
    url : 'ws://10.203.2.153:9090',
    // url : 'ws://192.168.50.44:9090',
    // url: 'ws://198.18.0.1:9090'
});
let is_detection_camera = false;
let detection_camera_data: string | null = null;
const pageTitle: string = 'Carry my Luggage';

let detection_camera: ROSLIB.Topic = new ROSLIB.Topic({
    ros: ros,
    name: 'robobreizh/detection_camera',
    messageType: 'sensor_msgs/CompressedImage'
});

detection_camera.subscribe(function (message: any): void {
    is_detection_camera = true;
    detection_camera_data = message.data;
});

window.onload = (): void => {
    let title = document.createElement('h1');
    let content_container = document.getElementById('content-container');
    title.innerHTML = `<h1>Camera is not connected</h1>`;
    console.log('is_detection_camera', is_detection_camera);
    if (is_detection_camera) {
        let img = document.createElement('img');
        img.src = 'data:image/jpeg;base64,' + detection_camera_data;
        img.alt = 'detection_camera';
        img.style.width = '100%';
        img.style.height = '100%';
        title.innerHTML = `<h1>Camera is connected</h1>`;
        if (content_container)
        {
            content_container.appendChild(title);
            content_container.appendChild(img);
        }
    }
    else
    {
        if (content_container)
        {
            content_container.appendChild(title);
        }
    }
};