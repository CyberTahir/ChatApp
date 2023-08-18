const express = require('express');
const app = express();
const cors = require('cors');
const server = require('http').createServer(app);
const um = require('./modules/users_manager');
const mm = require('./modules/message_manager');
const { handleRegUser, handleNewMessage, handleDisconnect, handleJoinRoom } = require('./modules/handlers');
const { userToHTML, messageToHTML } = require('./modules/converter');

const port = 4000;
const io = require('socket.io')(server, {
    cors: {
        origin: `http://localhost:${port}`
    }
});

app.use(cors());
app.use(express.static('assets'));
um.getUsersList();

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/assets/reg.html');
});

app.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/index.html');

    io.once('connection', socket => {
        socket.on('regUser', userData => {
            handleRegUser(userData);
            io.emit('requestUsersList');
        });

        socket.on('getUsersList', (userData) => {
            let sender = um.getUser(userData);

            socket.emit('updateUsersList', {
                html: um.map(user => userToHTML(user, sender)).join('\n'),
                user: sender
            });
        });

        socket.on('joinRoom', ({ senderData, recipientData, roomID }) => {
            let sender = um.getUser(senderData);
            let recipient = um.getUser(recipientData);
            let messages = JSON.parse( mm.getMessages(sender, recipient) )
                            .map(msg => messageToHTML(msg, sender))
                            .join('\n');
            
            console.log(sender, recipient);

            socket.emit('getMessages', messages);
        });

        socket.on('sendMessage', handleNewMessage);

        socket.on('disconnect', userData => {
            handleDisconnect(userData);
            io.emit('requestUsersList');
        });
    });
});

server.listen(port);