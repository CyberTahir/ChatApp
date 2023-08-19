// const { nanoid } = require('nanoid');
const fs = require('fs');
const { userToHTML } = require('../modules/converter');

class User {
    constructor(name, id, socketID = null, isActive = false) {
        this.name = name;
        this.id = id;
        this.isActive = isActive;
        this.socketID = socketID;
    }
}

const FILE_PATH = './db/users.json';
const users = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8')).map(userData => new User(userData.name, userData.id));

module.exports = (io, socket) => {
    const getUsers = (sender) => {
        let userList = users.map(user => userToHTML(user, sender)).join('\n');

        io.in(socket.roomID).emit('users', {
            html: userList,
            user: {
                name: sender.name,
                id: sender.id
            }
        });
    };

    const saveUsers = () => {
        fs.writeFileSync(
            FILE_PATH,
            JSON.stringify( users.map(user => ({ name: user.name, id: user.id }) ) ),
            'utf8'
        );
    };

    const addUser = ({ name }) => {
        let user = users.find(user => user.name === name);

        if (user === undefined) {
            let userID = nanoid(6);
            user = new User(username, userID, socket.id, true);
            users.push(user);

            saveUsers();
        }
        else {
            user.isActive = true;
        }

        getUsers(user);
    };

    const removeUser = (userID) => {
        let user = users.find( user => user.id === userID );
        if (user) {
            user.isActive = false;
        }

        getUsers();
    };

    socket.on('user:get', getUsers);
    socket.on('user:add', addUser);
    socket.on('user:leave', removeUser);
};