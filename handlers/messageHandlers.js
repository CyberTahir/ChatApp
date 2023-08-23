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
            .map(message => messageToHTML(message, socket.user))
            .join('\n');

        socket.emit('messages', messages);
    };

    const addMessage = (messageText) => {
        let messages = openMessagesFile().read();
        
        messages.push({
            senderID: socket.user.id,
            senderName: socket.user.name,
            messageText,
            createdAt: new Date()
        });

        db.write(messages);
        io.in(socket.room.id).emit('request:message');
    };

    socket.on('message:get', getMessages);
    socket.on('message:add', addMessage);
};