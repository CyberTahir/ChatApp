const fs = require('fs');
const DEFAULT_DATA = '[]';
const CHATS_PATH = 'db/rooms';

let filePath;

module.exports = {
    open(path) {
        filePath = path;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, DEFAULT_DATA, { encoding: 'utf-8' });
        }

        return this;
    },

    read() {
        let data = fs.readFileSync(filePath, { encoding: 'utf-8' });
        return JSON.parse(data);
    },

    write(data) {
        fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8' });
        return this;
    },

    openPrivate(firstId, secondId) {
        filePath = CHATS_PATH + `/private/${secondId}_${firstId}.json`;

        if (!fs.existsSync(filePath)) {
            filePath = CHATS_PATH + `/private/${firstId}_${secondId}.json`;
        }

        return this.open(filePath);
    }
};