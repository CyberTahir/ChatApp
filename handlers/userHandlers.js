const { nanoid } = require('nanoid');
const { userToHTML } = require('../modules/converter');
const db = require('../modules/localDB');

class User {
    constructor(name, id, isActive = false) {
        this.name = name;
        this.id = id;
        this.isActive = isActive;
    }
}

const FILE_PATH = './db/users.json';
const users = db.open(FILE_PATH)
                .read()
                .map(userData => new User(userData.name, userData.id));

const saveUsers = () => {
    db.open(FILE_PATH)
        .write( users.map(user => ({ name: user.name, id: user.id }) ) );
};

module.exports = (io, socket) => {
    const getUsers = () => {
        let userList = users.map(user => userToHTML(user, socket.user)).join('\n');

        socket.emit('users', userList);
    };

    const regUser = (name) => {
        let user = users.find(_user => _user.name === name);

        if (!user) {
            let userID = nanoid(6);
            user = new User(name, userID, true);
            users.push(user);

            saveUsers();
        }
        else {
            user.isActive = true;
        }

        socket.user = {
            name: user.name,
            id: user.id
        };
        
        io.emit('request:users');
    };

    const removeUser = () => {
        let user = users.find(user => user.id === socket.user.id);
        user.isActive = false;

        io.emit('requestUsers');
    };

    socket.on('user:join', regUser);
    socket.on('user:get', getUsers);
    socket.on('user:leave', removeUser);
};