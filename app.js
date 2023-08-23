const express = require('express');
const app = express();
const server = require('http').createServer(app);

const port = process.env.PORT || 4000;
const io = require('socket.io')(server, {
    cors: {
        origin: `http://localhost:${port}`
    }
});

const registerMessageHandlers = require('./handlers/messageHandlers');
const registerUserHandlers = require('./handlers/userHandlers');
const registerRoomHandlers = require('./handlers/roomHandlers');

function onConnection(io, socket) {
    registerMessageHandlers(io, socket);
    registerUserHandlers(io, socket);
    registerRoomHandlers(io, socket);

    socket.on('disconnect', () => {
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

server.listen(port, () => {
    console.log(`Сервер запущен! http://localhost:${port}`);
});