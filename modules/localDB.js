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
        try {
            return JSON.parse(fs.readFileSync(filePath, { encoding: 'utf-8' }));
        }
        catch (e) {
            return [];
        }
    },

    write(data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data), { encoding: 'utf-8' });
        }
        catch(e) {
            console.log(e);
        }
        
        return this;
    }
};