const fs = require('fs');
const { User } = require('./user');

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