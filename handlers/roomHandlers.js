const fs = require('fs');
const db = require('../modules/localDB');
const { roomToHTML } = require('../modules/converter');

module.exports = (io, socket) => {
    const getRoomID = (firstID, secondID) => {
        let fileName = secondID + '_' + firstID;

        if (!fs.existsSync('db/rooms/private/' + fileName + '.json')) {
            fileName = firstID + '_' + secondID;
        }

        return fileName;
    };

    const joinRoom = (room) => {
        let { type, id } = room;
        if (type === 'private' && socket.user.id === id) {
            return;
        }

        socket.room = {
            type,
            id: type === 'private' ? getRoomID(socket.user.id, id) : id
        };
        socket.join(socket.room.id);
    };

    const getRooms = () => {
        let rooms = db.open('db/rooms/public')
                    .read()
                    .map(roomToHTML)
                    .join('\n');

        socket.emit('rooms', rooms);
    };

    const leaveRoom = () => {
        if (socket.room) {
            socket.leave(socket.room.id);
            socket.room = undefined;
        }
    };
    
    socket.on('room:join', joinRoom);
    socket.on('room:list', getRooms);
    socket.on('room:leave', leaveRoom);
};