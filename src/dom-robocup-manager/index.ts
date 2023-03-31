function dynamic_colour_changer() {
    var dynamic_colour_class_names = ["button-red", "button-green", "button-blue", "button-yellow", "button-violet"];
    var dynamic_colour_objects = document.querySelectorAll(".dynamic_colour");
    for (var i = 0; i < dynamic_colour_objects.length; i++) {
        dynamic_colour_objects[i].className += " " + dynamic_colour_class_names[i % 5];
    }
}

function cascade_position_changer() {
    var button_positions = ["button-left", "button-right"];
    var cascade_position_objects = document.querySelectorAll(".cascade_position");
    for (var i = 0; i < cascade_position_objects.length; i++) {
        cascade_position_objects[i].className += " " + button_positions[i % 2];
    }
}

window.onload = function() {
    dynamic_colour_changer();
    cascade_position_changer();
};