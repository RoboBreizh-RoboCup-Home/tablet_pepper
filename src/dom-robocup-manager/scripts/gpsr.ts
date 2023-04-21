    var ros = new ROSLIB.Ros({
    url: 'ws://192.168.50.44:9090'
});

var sentence_gpsr = new ROSLIB.Topic({
    ros: ros,
    name: '/robobreizh/sentence_gpsr',
    messageType: 'std_msgs/String'
});
sentence_gpsr.subscribe(function (message) {
    create_popup(String(message.data));
});

function create_popup(gpsr_string) {
    if ((gpsr_string == "") || (gpsr_string == undefined)) {
        return;
    }
    var previous_popup = document.getElementsByClassName('popup');
    while (previous_popup.length > 0) {
        document.body.removeChild(previous_popup[0]);
    }
    var popup = document.createElement('div');
    popup.classList.add('popup');
    var popup_text = document.createElement('div');
    popup_text.classList.add('popup-text');
    popup_text.innerHTML = gpsr_string;
    popup_text.onclick = edit_word(popup_text);
    popup.appendChild(popup_text);
    var confirm_button = document.createElement('button');
    confirm_button.classList.add('btn');
    confirm_button.classList.add('btn-primary');
    confirm_button.classList.add('popup-confirm');
    confirm_button.innerHTML = "Looks good!";
    confirm_button.onclick = function () {
        var sentence = get_sentence();
        document.body.removeChild(popup);
        return;
    };
    popup.appendChild(confirm_button);
    document.body.appendChild(popup);
}
function edit_word(token) {
    return function () {
        var new_text = prompt("Edit sentence", token.innerHTML.trim());
        if ((new_text != null) && (new_text.trim() != "") && (new_text.trim() != "null")) {
            token.innerHTML = new_text;
        };
    }
}
function get_sentence() {
    var sentence = "";
    var corrected_sentence = document.getElementsByClassName('popup-text');
    for (var i = 0; i < corrected_sentence.length; i++) {
        sentence += corrected_sentence[i].innerHTML.trim() + " ";
    }
    sentence = sentence.trim();
    var sentence_sender = new ROSLIB.Topic({
        ros: ros,
        name: '/robobreizh/sentence_gpsr_corrected',
        messageType: 'std_msgs/String'
    });
    var sentence_msg = new ROSLIB.Message({
        data: sentence
    });
    sentence_sender.publish(sentence_msg);
    return sentence;
}