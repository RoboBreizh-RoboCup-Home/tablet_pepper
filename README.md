Pepper Tablet Interface
===================

This webpage is supposed to be use in order for the user to trigger different task and have feedback on different topic.
As there is no server running. The webpage is a single webpage processing everything using js to interact with DOM and 
the lib roslib.js from RobotWebTools to communicate with ROS topics.

The main page shows a series of button for triggering different task

## Development

The only file run on the tablet is the index.html along with the imported files inside it.
For better development we use typescript as for creating the app.

- First you need to install the modules using npm (make sure it is installed on your machine) 
go to the src folder and run 
```
npm install
```

Now you can compile your ts file using 
```
tsc app.ts
```
A JavaScript file wiht the same name will be generated (app.ts will generate app.js)  

Typescript compiler is used in order to convert typescript to a certain version of javascript. You can see details in the tsconfig.json.
While the application is growing larger you might end up with multiple .js files and .css file to import along with assets and need to optimize the app.
In order to do that you will need to use webpack. Feel free to look at this [link](https://www.youtube.com/watch?v=5IG4UmULyoA) to have a small understanding of how 
webpack works.

Run the following command to compile app.ts using webpack with the following command :
```
npx webpack
```

The webpage were written in plain HTML, CSS, and JavaScript, to meet the limited javascript availability on pepper, namely JavaScript 1.7 and Mozilla 5.0.

## Installation

First, make sure you have the latest version of the tablet web app
Under robobreizh_pepper_ws/src/tablet_pepper/src/dom-robocup-manager
```
git checkout main
git pull
```

Then, copy the files from the workspace to the folder we are going to place the web app

```
cp -r ~/robobreizh_pepper_ws/src/tablet_pepper/src/dom-robocup-manager/* ~/.local/share/PackageManager/apps/tablet/html
```

And now, the files should be in the correct folder for running.

In order to set up the auto load on start, add this line to ~/naoqi/preferences/autoload.ini, under [python]

```
/home/nao/robobreizh_pepper_ws/src/tablet_pepper/src/dom-robocup-manager/start_tablet_on_boot.py
```

## Deployment

Under src/dom-robocup-manager/scripts, there is a shell script called deploy.sh to easily change the ip addresses in the js scripts and move the files to the apps folder

run it with:
```
sh deploy.sh <robot_ip>
```

## Execution

The webpage should show automatically 2 minutes after the robot booted with the "start_tablet_on_boot.py" script, 
and it will also trigger set my pepper straight

Alternatively the webpage can be ran manually with the following command:
```
ssh nao@192.168.50.44
exit
qicli call ALTabletService.showWebview "http://198.18.0.1/apps/tablet/index.html"
```
Or this command in ~/
```
python start_tablet.py
```

## Autoload

The "start_tablet_on_boot.py" script is linked to ~/naoqi/preferences/autoload.ini to run on boot, note that on load scripts are will be ran with python 2.7, more documentations are available here, under Loading a module at startup: http://doc.aldebaran.com/2-5/dev/tools/naoqi.html.
