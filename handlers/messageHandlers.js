const db = require('../modules/localDB');
const { messageToHTML } = require('../modules/converter');

module.exports = (io, socket) => {
    const getMessages = (user) => {
        let messages = db
            .open(`db/messages/${socket.roomID}.json`)
            .read()
            .map(message => messageToHTML(message, user))
            .join('\n');

        io.in(socket.roomID).emit('messages', messages);
    };

    const addMessage = (message) => {
        let messages = db.open('db/messages.json')
            .read();
        
        messages.push({
            messageID: nanoid(8),
            createdAt: new Date(),
            ...message
        });

        db.write(messages);
        getMessages();
    };

    socket.on('message:get', getMessages);
    socket.on('message:add', addMessage);
};