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
    update_image(message.data);
});
operator_text.subscribe(function (message) {
    update_text(camel_case_to_sentence_case(String(message.data)), "operator_text");
});
robot_text.subscribe(function (message) {
    update_text(camel_case_to_sentence_case(String(message.data)), "robot_text");
});
var replacement_text = {
    "CarryMyLuggage": {
        "initCarryMyLuggage.exec": "Initializing carry my luggage",
        "NavigationMoveTowardsLocation_instructionPoint.exec": "Moving to instruction point",
        "DialogAskHuman_waveHand.exec": "Asking human to wave hand",
        "DialogSay_HelloIAmPepperYourButtler_animated.exec": "Introducing myself",
        "VisionFindHuman.exec": "Finding human",
        "VisionWaitForHumanWavingHand.exec": "Waiting for human to wave hand",
        "NavigationMoveTowardsObject_bag.exec": "Moving to bag",
        "DialogSay_CouldYouPleaseShowMeTheBagYouWantMeToCarry_animated.exec": "Asking human to show bag",
        "VisionFindObjectPointedByHuman.exec": "Finding bag",
        "DialogSay_CouldYouPleaseHangTheBagOnMyWrist_normal.exec": "Asking human to hang bag on wrist",
        "DialogSay_IAmReadyToFollowYouPleaseRaiseYourHandWhenYouReachedYourDestination_normal.exec": "Ready to follow human",
        "NavigationFollowHuman.exec": "Following human",
        "DialogSay_CouldYouPleaseTakeYourBag.exec": "Asking human to take bag",
        "NavigationMoveTowardsLocation_LivingRoom.exec": "Moving to living room",
        "NavigationMoveBehindHuman.exec": "Moving behind human",
        "DialogSay_CouldLastPersonInQueueWaveYourHand.exec": "Asking last person in queue to wave hand",
        "ManipulationBendArms_Right.exec": "Bending arms",
        "GestureLookAt_Human.exec": "Looking at human",
        "VisionWaitForHumanWavingHand.exec [HNotFound]": "Waiting for human to wave hand"
    },
    "GPSR": {
        "initGPSR.exec": "Initializing GPSR",
        "NavigationMoveTowardsLocation_arena.exec": "Moving to arena",
        "DialogAskHuman_waveHand.exec": "Asking human to wave hand",
        "DialogGreetHuman.exec": "Greeting human",
        "VisionFindHuman.exec": "Finding human",
        "VisionFindhumanWavingHand.exec": "Finding human waving hand",
        "NavigationMoveTowardsHuman.exec": "Moving towards human",
        "DialogAskHuman_Orders.exec": "Asking human for orders",
        "DialogListenOrders.exec": "Listening to orders",
        "ProcessOrders.exec": "Processing orders",
        "NavigationGoTo_arena.exec": "Going to arena",
        "NavigationMoveTowardsGPSRTarget.exec": "Moving towards GPSR target",
        "VisionWaitForDoorOpening.exec": "Waiting for door to open",
        "VisionFindObject_Cup.exec": "Finding cup",
        "NavigationMoveTowardsGPSRTarget_Cup.exec": "Moving towards GPSR target",
        "NavigationTurnTowards_Human.exec": "Turning towards human",
        "DialogAskHumanTake_Cup.exec": "Asking human to take cup",
        "DialogAskActionConfirmation.exec": "Asking human to confirm action",
        "DialogListenConfirmation.exec": "Listening to human's confirmation",
        "DialogAskHumanToFollow.exec": "Asking human to follow",
        "DialogTellHumanObjectLocation_Cup.exec": "Telling human object location",
        "OtherChangePlan_GPSRTakeOrder.exec": "Changing plan to take order",
        "OtherChangePlan_GPSRLobby.exec": "Changing plan to lobby",
        "OtherChangePlan_GPSRSubGiveMeCup.exec": "Changing plan to give me cup",
        "OtherChangePlan_GPSRSubShowMeCup.exec": "Changing plan to show me cup",
        "OtherChangePlan_GPSRSubMoveTowards.exec": "Changing plan to move towards",
        "OtherChangePlan_GPSRSubEscortHuman.exec": "Changing plan to escort human",
        "OtherChangePlan_GPSRSubFindObject.exec": "Changing plan to find object",
        "OtherChangePlan_GPSRSubFollowHuman.exec": "Changing plan to follow human",
        "OtherChangePlan_GPSRSubFindHuman.exec": "Changing plan to find human",
        "OtherChangePlan_GPSRSubTell.exec": "Changing plan to tell",
        "OtherChangePlan_GPSRSubTakeObject.exec:": "Changing plan to take object",
        "OtherChangePlan_GPSRSubGreet.exec": "Changing plan to greet",
        "VisionFindHumanAndStoreFeaturesWithDistanceFilter_2.exec": "Finding human and storing features with distance filter",
        "OtherIsHumanKnown_GPSR.exec": "Checking if human is known",
        "NavigationMoveTowardsHuman_GPSR.exec": "Moving towards human",
        "DialogAskHumanToFollowToLocation_GPSR.exec": "Asking human to follow to location",
        "DialogAskHumanNameConfirmation_GPSR.exec": "Asking human name confirmation",
        "NavigationMoveTowardsLocation_GPSR.exec": "Moving towards location",
        "DialogTellHumanDestinationArrived_GPSR_GPSR.exec": "Telling human destination arrived",
        "NavigationRotate_40.exec": "Rotating",
        "DialogListenConfirmation_GPSR.exec": "Listening to confirmation",
        "VisionFindObject_GPSR.exec": "Finding object",
        "DialogTellHumanObjectLocation_GPSR.exec": "Telling human object location",
        "NavigationFollowHuman.exec": "Following human",
        "DialogGreet_GPSR.exec": "Greeting",
        "DialogAskHumanToFollow_GPSR.exec": "Asking human to follow",
        "NavigationMoveTowardsLocation_Destination.exec": "Moving towards location",
        "DialogAskHumanTake_GPSR.exec": "Asking human to take",
        "NavigationMoveTowardsLocation_Source.exec": "Moving towards location",
        "OtherChooseTake.exec": "Choosing take",
        "DialogSay_IDontKnowTheLocationProvidedIWillSkipThisIntent.exec": "Saying I don't know the location provided",
        "NavigationMoveTowardsLocation_instructionPoint.exec": "Moving to instruction point",
        "VisionWaitForHumanWavingHand.exec": "Waiting for human to wave hand",
        "ManipulationLook_Up.exec": "Looking up",
        "ManipulationLook_Down.exec": "Looking down",
        "DialogSay_CanYouPleaseComeCloser.exec": "Asking human to come closer",
        "DialogSay_IHaveUnderstoodYourRequestButUnfortunatelyICanNotDoThatPleaseGiveMeAnotherOne.exec": "Saying I have understood your request but unfortunately I can not do that",
        "DialogSay_HaveICorrectlyUnderstoodYourRequestPleaseAnswerByYesOrNo.exec": "Asking if I have correctly understood the request"
    },
    "Receptionist": {
        "initReceptionist.exec": "Initializing receptionist",
        "NavigationMoveTowardsLocation_guestEntrance.exec": "Moving to guest entrance",
        "VisionFindHumanAndStoreFeatures.exec": "Finding guest",
        "DialogSay_WelcomeToTheTestArena.exec": "Welcoming guest",
        "DialogAskHuman_Name.exec": "Asking guest for name",
        "DialogListen_Name.exec": "Listening to guest's name",
        "DialogAskHuman_FavoriteDrink.exec;": "Asking guest for favorite drink",
        "DialogListen_Drink.exec": "Listening to guest's favorite drink",
        "DialogAskHumanToFollowToLocation_livingRoom.exec": "Asking guest to follow to living room",
        "NavigationMoveTowardsLocation_livingRoom.exec": "Moving to living room",
        "VisionFindEmptySeat.exec": "Finding empty seat",
        "DialogOfferSeatToHuman_Guest.exec": "Offering seat to guest",
        "DialogIntroduceAtoB_Guest1_Guest2.exec": "Introducing guest to other guest",
        "OtherCheckForMoreGuests.exec": "Checking for more guests",
        "DialogIntroduceAtoB_Guest2_Guest1.exec": "Introducing new guest to guests",
        "DialogIntroduceAtoB_Guest_Host.exec": "Introducing new guest to host",
        "DialogIntroduceAtoB_Host_Guest.exec": "Introducing host to new guest",
        "DialogSay_CouldYouStandInFrontOfMePlease.exec": "Asking guest to stand in front of me",
        "DialogSay_IWillBeLookingForAnEmptyChair.exec": "Looking for empty chair",
        "DialogSay_LetMeFindAnotherGuest.exec": "Looking for another guest",
        "NavigationRotate_40.exec": "Rotating",
        "ManipulationLook_Up.exec": "Looking up",
        "ManipulationLook_Down.exec": "Looking down",
        "VisionFindHumanAndStoreFeaturesWithDistanceFilter_host.exec": "Finding host",
        "NavigationRotate_minus40.exec": "Rotating"
    },
    "ServeBreakfast": {
        "initServeBreakfast.exec": "Initializing serve breakfast",
        "VisionWaitForDoorOpening.exec": "Waiting for door to open",
        "NavigationMoveTowardsLocation_kitchen.exec": "Moving to kitchen",
        "NavigationMoveTowardsLocation_kitchenShelf.exec": "Moving to kitchen shelf",
        "VisionFindObject_Bowl.exec": "Finding bowl",
        "ManipulationGraspObject_Bowl_Both.exec": "Grasping bowl",
        "NavigationMoveTowardsLocation_KitchenTable.exec": "Moving to kitchen table",
        "ManipulationPutObject_Both.exec": "Putting bowl on table",
        "VisionFindObject_Spoon.exec": "Finding spoon",
        "ManipulationGraspObject_Spoon.exec": "Grasping spoon",
        "ManipulationPutObject_Left.exec": "Putting spoon on left side of table",
        "VisionFindObject_CerealBox.exec": "Finding cereal box",
        "ManipulationGraspObject_CerealBox_Both.exec": "Grasping cereal box",
        "VisionFindObject_MilkCarton.exec": "Finding milk carton",
        "ManipulationGraspObject_MilkCarton_Both.exec": "Grasping milk carton",
        "ManipulationPourObject_Both_Bowl.exec": "Pouring milk into bowl"
    },
    "StoringGroceries": {
        "initStoringGroceries.exec": "Initializing storing groceries",
        "NavigationMoveTowardsLocation_livingRoom.exec": "Moving to living room",
        "VisionWaitForDoorOpening.exec": "Waiting for door to open",
        "DialogSay_LetsSeeWhatWeCanFindHere.exec": "Looking for groceries",
        "NavigationMoveTowardsLocation_sideTable.exec": "Moving to side table",
        "VisionFindObject_All.exec": "Locating grocery items",
        "DialogAskHumanTakeLastObject.exec": "Asking human to take last object",
        "DialogAskActionConfirmation.exec": "Asking human to confirm action",
        "DialogListenConfirmation.exec": "Listening to human's confirmation",
        "NavigationMoveTowardsLocation_cupboard.exec": "Moving to cupboard",
        "VisionLocatePositionToPlaceObject.exec": "Locating position to place object",
        "OtherCheckMoreObjectToFind.exec": "Checking for more objects to find",
        "ManipulationLook_Down.exec": "Looking down",
        "ManipulationLook_Up.exec": "Looking up",
        "DialogSay_IAmDoneWithMyWorkHere.exec": "Done with work",
        "DialogSay_NowPleaseFollowMe.exec": "Asking human to follow me",
        "DialogSay_LetMeThinkAboutWhereTheObjectNeedsToBePlaced.exec": "Thinking about where to place object",
        "DialogSay_PleaseFollowMeToOurStartingPoint.exec": "Asking human to follow me to starting point"
    },
    "CleanTheTable": {
        "initCleanTheTable.exec": "Initializing clean the table",
        "VisionWaitForDoorOpening.exec": "Waiting for door to open",
        "NavigationMoveTowardsLocation_kitchen.exec": "Moving to kitchen",
        "VisionFindObject_Table.exec": "Finding table",
        "NavigationRotate_minus40.exec": "Rotating",
        "VisionFindObject_Dishwasher.exec": "Finding dishwasher",
        "ManipulationLook_Down.exec": "Looking down",
        "ManipulationLook_Up.exec": "Looking up",
        "NavigationMoveTowardsObject_Dishwasher.exec": "Moving to dishwasher",
        "VisionFindObject_DishwasherHandle.exec": "Finding dishwasher handle",
        "ManipulationGrabHandle_DishwasherHandle_Right.exec": "Grabbing dishwasher handle",
        "VisionFindObject_DishwasherRack.exec": "Finding dishwasher rack",
        "ManipulationPullObject_DishwasherRack_Both.exec": "Pulling dishwasher rack",
        "NavigationMoveTowardsObject_Table.exec": "Moving to table"
    },
    "Restaurant": {
        "initRestaurant.exec": "Initializing restaurant",
        "DialogAskHuman_waveHand.exec": "Asking human to wave hand",
        "VisionWaitForHumanWavingHand_storeInformation.exec": "Waiting for human to wave hand",
        "NavigationMoveTowardsHuman_nextCustomer.exec": "Moving to next customer",
        "GestureLookAt_nextCustomer.exec": "Looking at next customer",
        "DialogSay_Hello.exec": "Saying hello",
        "DialogSay_WhatDrinkWouldYouLikeToday.exec": "Asking for drink",
        "DialogListen_Drink.exec": "Listening to guest's favorite drink order",
        "NavigationMoveTowardsLocation_kitchenTable.exec": "Moving to kitchen table",
        "DialogAskOperatorHelp_CustomerOrder.exec": "Asking operator to help with customer's order",
        "DialogAskActionConfirmation.exec": "Asking human to confirm action",
        "DialogListenConfirmation.exec": "Listening to human's confirmation",
        "DialogAskHuman_TakeOrderOnTray.exec": "Asking human to take order on tray"
    },
    "Stickler": {
        "initStickler.exec": "Initializing stickler",
        "NavigationMoveTowardsLocation_centerPoint.exec": "Moving to center point",
        "DialogSay_IWillSeeIfThereIsAnySticklerInTheHouse.exec": "Looking for stickler",
        "OtherChangePlan_SticklerLobby.exec": "Changing plan to stickler lobby",
        "ManipulationLook_Up.exec": "Looking up",
        "DialogSay_YouAreBreakingTheForbiddenRoomRule.exec": "Telling human they are breaking the rule",
        "ManipulationPointAt.exec": "Pointing at human",
        "DialogSay_NoGuestIsAllowedInsideThisRoomCouldYouPleaseLeaveThisRoom.exec": "Asking human to leave the room",
        "OtherChangePlan_SticklerForbiddenRoomSecondAttempt.exec": "Changing plan to stickler forbidden room second attempt",
        "OtherWait_5.exec": "Waiting",
        "DialogSay_IFoundAPersonInTheForbiddenRoom.exec": "Telling human I found a person in the forbidden room",
        "DialogSay_IWillNevigateTowardsForbiddenRoom.exec": "Telling human I will navigate towards the forbidden room",
        "NavigationMoveTowardsLocation_sticklerBedroom1.exec": "Moving to stickler bedroom",
        "DialogSay_ThankYouForRespectingTheRule.exec": "Thanking human for respecting the rule",
        "DialogSay_YouAreStillBreakingTheForbiddenRoomRule.exec": "Telling human they are still breaking the rule",
        "DialogSay_IKindlyRequestYouAgainToLeaveTheRoom.exec": "Asking human to leave the room",
        "ManipulationLook_DownStickler.exec": "Looking down",
        "NavigationMoveTowardsLocation_startingPointStickler.exec": "Moving to starting point",
        "NavigationMoveTowardsLocation_sticklerBedroom2.exec": "Moving to stickler bedroom",
        "VisionFindHumanAndStoreFeaturesWithDistanceFilter_3.exec": "Finding human",
        "VisionFindStickler.exec": "Finding stickler",
        "DialogSay_IKindlyRequestYouAgainToComeOutOfTheRoom.exec": "Asking human to come out of the room",
        "OtherFindHumanInForbiddenRoom.exec": "Finding human in forbidden room",
        "NavigationRotate_minus40.exec": "Rotating",
        "OtherChangePlan_SticklerShoesFirstAttempt.exec": "Changing plan to stickler shoes first attempt",
        "OtherChangePlan_SticklerNoDrinkFirstAttempt.exec": "First time asking human to bring drink",
        "OtherChangePlan_SticklerLitterFirstAttempt.exec": "First time asking human not to litter",
        "OtherChangePlan_SticklerForbiddenRoomFirstAttempt.exec": "First time asking human not to enter forbidden room",
        "DialogSay_YouAreBreakingTheCompulsoryHydrationRule.exec": "Telling human they are breaking the compulsory hydration rule",
        "DialogSay_CouldYouPleaseFindADrinkAndReturnToYourPosition.exec": "Asking human to find a drink and return to their position",
        "OtherChangePlan_StricklerNoDrinkSecondAttempt.exec": "Second time asking human to bring drink",
        "DialogSay_YouHaveNoDrinkInYourHand.exec": "Telling human they have no drink in their hand",
        "DialogSay_IKindlyRemindYouThatYouAreBreakingTheCompulsoryHydrationRule.exec": "Reminding human they are breaking the compulsory hydration rule",
        "VisionFindHumanWithTimeout_10.exec": "Finding human",
        "DialogSay_IKindlyRequestYouAgainToBringYourDrinkToStayHydrated.exec": "Asking human to bring their drink to stay hydrated",
        "VisionFindPersonWithoutDrink.exec": "Finding person without drink",
        "initFindMyMate.exec": "Initializing find my mate",
        "VisionFindPersonWithShoes_2.exec": "Finding person with shoes",
        "DialogSay_YouAreWearingShoes.exec": "Telling human they are wearing shoes",
        "DialogSay_IWillSeeIfThereIsAnySticklerInTheRoom.exec": "Looking for stickler",
        "ManipulationLook_Down.exec": "Looking down",
        "NavigationRotate_40.exec": "Rotating",
        "VisionFindHuman.exec": "Finding human",
        "DialogSay_YouDidNotRemoveYourShoes.exec": "Telling human they did not remove their shoes",
        "DialogSay_IKindlyRequestYouAgainToRemoveYourShoes.exec": "Asking human to remove their shoes",
        "DialogSay_CouldYouPleaseRemoveYourShoesOutsideAndReturnToYourPosition.exec": "Asking human to remove their shoes outside and return to their position",
        "OtherChangePlan_StricklerShoesSecondAttempt.exec": "Second time asking human to remove shoes",
        "OtherWait_10.exec": "Waiting",
        "DialogSay_NoShoesAreAllowedInsideTheHouse.exec": "Telling human no shoes are allowed inside the house",
        "VisionFindPersonWithShoes.exec": "Finding person with shoes"
    }
};
var last_task = "";
current_task_listener.subscribe(function (message) {
    if (String(message.data).slice(-5) == ".exec") {
        var title = document.getElementById('title').innerHTML;
        if (replacement_text[title][String(message.data)] != last_task) {
            if (replacement_text[title][String(message.data)] == "") {
                return;
            }
            last_task = replacement_text[title][message.data];
            update_task(last_task);
        }
    }
    ;
});
ros.on('connection', function () {
    ready_to_display(function () { });
});
ros.on('error', function (error) {
    // console.log(error);
    unsubscribe();
});
ros.on('close', function () {
    unsubscribe();
});
function ready_to_display(callback) {
    start_button_click();
    var start_button = document.getElementById('start-button');
    start_button.disabled = true;
    var line = document.getElementsByClassName('line');
    line[0].style.display = "inline";
    var text_prompts = document.getElementsByClassName('to-be-cleared');
    for (var i = 0; i < text_prompts.length; i++) {
        text_prompts[i].innerHTML = text_prompts[i].innerHTML.replace("disconnected", "✅");
    }
    setTimeout(function () {
        var text_prompts = document.getElementsByClassName('to-be-cleared');
        for (var i = 0; i < text_prompts.length; i++) {
            text_prompts[i].innerHTML = "";
        }
        callback();
    }, 1000);
    var buttons = document.getElementsByClassName('on-connect');
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].style.display = "inline";
    }
}
function start_button_click() {
    initialize();
    var start_button = document.getElementById('start-button');
    start_button.disabled = true;
    var stop_button = document.getElementById('stop-button');
    stop_button.disabled = false;
    var start_button_publisher = new ROSLIB.Topic({
        ros: ros,
        name: '/pnp/planToExec',
        messageType: 'std_msgs/String'
    });
    var message = document.getElementById('title').innerHTML;
    var start_message = new ROSLIB.Message({
        data: message
    });
    start_button_publisher.publish(start_message);
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
function emphasize_new_update(id) {
    var element = document.getElementById(id);
    for (var i = 0; i < element.children.length; i++) {
        element.children[i].style.textDecoration = "none";
        element.children[i].style.fontWeight = "normal";
        element.children[i].style.listStyleType = "circle";
    }
    if (element.children.length > 0) {
        element.children[element.children.length - 1].style.textDecoration = "underline";
        element.children[element.children.length - 1].style.fontWeight = "bold";
        element.children[element.children.length - 1].style.listStyleType = "disc";
    }
}
function camel_case_to_sentence_case(text) {
    var sentence = text.replace(/([A-Z])/g, ' $1').toLowerCase().replace('_', ' ');
    if (sentence.charAt(0) == ' ') {
        sentence = sentence.substr(1);
    }
    // if pattern "g p s r" or "e g p s r" is detected in the sentence, replace with "GPSR" or "EGPSR"
    if (sentence.indexOf("g p s r") != -1) {
        sentence = sentence.replace("g p s r", "GPSR");
    }
    if (sentence.indexOf("e g p s r") != -1) {
        sentence = sentence.replace("e g p s r", "EGPSR");
    }
    sentence = sentence.replace(" i ", " I ");
    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}
function resize_image(img) {
    // resize image to 14:10 ratio
    var ratio = 12 / 11;
    var width = img.width;
    var height = img.height;
    if (width / height > ratio) {
        img.width = height * ratio;
    }
    else {
        img.height = width / ratio;
    }
}
function update_image(new_image) {
    var image = document.getElementById('detection-camera');
    image.src = 'data:image/jpeg;base64,' + String(new_image);
    resize_image(image);
}
function update_text(new_text, source) {
    var convo = document.getElementById('convo');
    var new_convo = document.createElement('li');
    var children = convo.children;
    new_convo.classList.add(String(source));
    new_convo.innerHTML = new_text;
    convo.appendChild(new_convo);
    while (children.length > 3) {
        convo.removeChild(children[0]);
    }
    convo.scrollTop = convo.scrollHeight;
}
function update_task(new_task) {
    var task = document.getElementById('task-items');
    if ((task.children.length > 0) && (task.children[task.children.length - 1].innerHTML == new_task)) {
        return;
    }
    var new_task_item = document.createElement('li');
    new_task_item.innerHTML = new_task;
    var children = task.children;
    task.appendChild(new_task_item);
    while (children.length > 3) {
        task.removeChild(children[0]);
    }
    task.scrollTop = task.scrollHeight;
    emphasize_new_update('task-items');
}
function unsubscribe() {
    if (detection_camera) {
        detection_camera.unsubscribe();
    }
    if (operator_text) {
        operator_text.unsubscribe();
    }
    if (robot_text) {
        robot_text.unsubscribe();
    }
    if (current_task_listener) {
        current_task_listener.unsubscribe();
    }
    detection_camera = null;
    operator_text = null;
    robot_text = null;
    current_task_listener = null;
}
function initialize() {
    var task_items = document.getElementById('task-items');
    task_items.innerHTML = "";
    var convo = document.getElementById('convo');
    convo.innerHTML = "";
}
