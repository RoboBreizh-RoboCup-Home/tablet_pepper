
const WebSocket = require('ws');
const readline = require('readline')
const wss = new WebSocket.Server({ port: 8080 });

wss.on('connection', (ws) => {
  ws.on('message', (message) => {
    console.log(message.toString());
    console.log(`\nReceived message: ${JSON.parse(message.toString())}`);
    // ws.send(`Echo: ${message}`);
  });
});

console.log('WebSocket server is running on port 8080');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const sendMessage = () => {
  rl.question('Enter a message to send: ', (message)=>{
  wss.clients.forEach((client)=>{
    if (client.readyState == WebSocket.OPEN) {
      client.send(JSON.parse(message));
    }
  });
  if( message === "stop"){
    rl.close();
    wss.close();
  } else {
    sendMessage();
  }
});
};

sendMessage();
/*
"{\"type\": \"webpage\", \"url\": \"https://svt.se\"}"
"{\"type\": \"image\", \"url\": \"assets/logo.png\"}"

*/