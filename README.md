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

Now you can compile your app.ts file using using 
```
tsc --outFile app.js app.ts
```

Typescript compiler is used in order to convert typescript to a certain version of javascript. You can see details in the tsconfig.json.
While the application is growing larger you might end up with multiple .js files and .css file to import along with assets and need to optimize the app.
In order to do that you will need to use webpack. Feel free to look at this [link](https://www.youtube.com/watch?v=5IG4UmULyoA) to have a small understanding of how 
webpack works.
Run the following command to compile app.ts using webpack with the following command :
```
npx webpack
```

In order to put the files on the robot you would need to copy the index.html along with the necessary import to /home/nao/.local/share/PackageManager/apps/tablet/html with the following command:
scp -r /dom-robocup-manager/* nao@192.168.50.44:~/.local/share/PackageManager/apps/tablet/html

It the webpage can be ran manually with the following command:
```
ssh nao@192.168.50.44
exit
qicli call ALTabletService.showWebview "http://198.18.0.1/apps/tablet/index.html"
```

The file start_tablet_on_boot.py should be started on boot of the robot and launch the webpage on the tablet
## In the future
Using pico.css instead of native css might be a good solution
