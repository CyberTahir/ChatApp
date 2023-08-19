const fs = require('fs');
const DEFAULT_DATA = '[]';

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
    }
};