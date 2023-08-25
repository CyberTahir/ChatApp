# Real-time chat application.

This chat application built using Node.js, Express and Socket.IO.

![alt text](https://dl.dropboxusercontent.com/scl/fi/1kjklovj8x7eqdqh7k52k/ChatApp.png?rlkey=l17kj40q9i8p475ar8kzguekj&dl=0)


# Features
  <li>Uses Express as the application Framework.</li>
  <li>Real-time client-server communication provided by Socket.io</li>
  <li>Uses selfmade "localDB" module for storing messages and querying data.</li>
  <li>Provides private chatting and public chat rooms.</li>
  <li>Online/offline user's status.</li>



# Installation

### Running locally

Make sure you have Node.js and npm install.

 1. Clone or download the repository
    <pre>gir clone https://github.com/CyberTahir/ChatApp.git
    $ cd ChatApp</pre>
 2. Install dependencies
    <pre>npm install</pre>
 3. Start the application
    <pre>node app.js</pre>

 Application runs from localhost:4000.

## Sockets
    
   Having an active connection opened between the client and the server so client can send and receive data. This allows             real-time communication using TCP sockets. This is made possible by Socket.io.

   The client starts by connecting to the server through a socket(maybe also assigned to a specific namespace). Once connections is successful, client and server can emit and listen to events.