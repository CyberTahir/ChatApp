const express = require('express');
const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 4000;
const io = require('socket.io')(server, {
    cors: {
        origin: '*' // `http://localhost:${port}`
    }
});

const log = console.log;

const registerMessageHandlers = require('./handlers/messageHandlers');
const registerUserHandlers = require('./handlers/userHandlers');

function onConnection(io, socket) {
    log('User connected ', socket.id);

    let { roomID } = socket.handshake.query;
    socket.roomID = roomID;
    socket.join(roomID);

    registerMessageHandlers(io, socket);
    registerUserHandlers(io, socket);

    socket.on('disconnect', () => {
        log('User disconnected ', socket.id);

        socket.leave(socket.roomID);
    });
}

io.on('connection', socket => onConnection(io, socket));

app.use(express.static('assets'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/assets/reg.html');
});
app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

server.listen(port);