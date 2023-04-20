var ros = new ROSLIB.Ros({
    url: 'ws://192.168.50.44:9090'
});

// robobreizh/sentence_gpsr
var sentence_gpsr = new ROSLIB.Topic({
    ros: ros,
    name: '/sentence_gpsr',
    messageType: 'std_msgs/String'
});
var previous_sentence_gpsr = "";
sentence_gpsr.subscribe(function (message) {
    if (previous_sentence_gpsr != String(message.data)) {
      previous_sentence_gpsr = String(message.data);
      create_popup(String(message.data));
    }
  });

var last_popup_time = 0;
const popup_cooldown = 5 * 1000;
function create_popup(gpsr_string) {
    var now = Date.now();
    if (now - last_popup_time < popup_cooldown) {
        // Cooldown period not elapsed yet, do nothing
        return;
    }
    // Cooldown period elapsed, create popup and update last_popup_time
    last_popup_time = now;
    var popup = document.createElement('div');
    popup.classList.add('popup');
    var popup_text = document.createElement('div');
    popup_text.classList.add('popup-text');
    popup_text.innerHTML = gpsr_string;
    popup_text.onclick = edit_word(popup_text);
    popup.appendChild(popup_text);
    document.body.appendChild(popup);
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
}

// edit a word in the popup
function edit_word(token) {
    return function () {
        var new_text = prompt("Edit word", token.innerHTML.trim());
        if ((new_text != null) && (new_text != '') && new_text.trim() != "null") {
            token.innerHTML = new_text;
        };
    }
}

// should only be called after the popup is confirmed
// returns the sentence as a string
// send back the confirmed string to the robot
function get_sentence() {
    var sentence = "";
    var tokens = document.getElementsByClassName('popup-text');
    for (var i = 0; i < tokens.length; i++) {
        sentence += tokens[i].innerHTML.trim() + " ";
    }
    return sentence.trim();
}