const db = require('../modules/localDB');
const { messageToHTML } = require('../modules/converter');

module.exports = (io, socket) => {
    const openMessagesFile = () => {
        let { type, id } = socket.room;
        return db.open(`db/rooms/${type}/${id}.json`);
    };

    const getMessages = () => {
        if (!socket.room) {
            return;
        }

        let messages = openMessagesFile()
                .read()
                .map(message => messageToHTML(message, socket.user, socket.room.type))
                .join('\n');

        socket.emit('messages', messages);
    };

    const addMessage = (messageText) => {
        let newMessage = {
            senderID: socket.user.id,
            senderName: socket.room.type === 'public' ? socket.user.name : undefined,
            messageText,
            createdAt: new Date()
        };
        
        let messages = openMessagesFile().read();
        messages.push(newMessage);

        db.write(messages);
        io.in(socket.room.id).emit('request:message');
    };

    socket.on('message:get', getMessages);
    socket.on('message:add', addMessage);
};