const fs = require('fs');

class User {
    constructor(name, id, socketID = null, isActive = false) {
        this.name = name;
        this.id = id;
        this.isActive = isActive;
        this.socketID = socketID;
    }
}

const FILE_PATH = './users.json';
let users = [];

module.exports = {
    getUsersList() {
        users = JSON.parse(fs.readFileSync(FILE_PATH, 'utf8'))
                        .map(userData => new User(userData.name, userData.id));
        return users;
    },

    addNewUser({ name }) {
        let newUser = new User(name, users.length);
        users.push(newUser);

        let json = JSON.stringify( users.map(user => ({ name: user.name, id: user.id })) )
        fs.writeFile( FILE_PATH, json, () => {} );

        return newUser;
    },

    getUser(data) {
        return users.find( user => user.name === data.name );
    },

    map: (callback) => users.map(callback)
};