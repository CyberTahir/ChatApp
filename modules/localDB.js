const fs = require('fs');
const DEFAULT_DATA = '[]';
const options = {
    encoding: 'utf-8'
};

let filePath;

module.exports = {
    open(path) {
        filePath = path;

        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, DEFAULT_DATA, options);
        }

        return this;
    },

    read() {
        try {
            let data;

            if ( fs.statSync(filePath).isDirectory() ) {
                data = fs.readdirSync(filePath, options);
            }
            else {
                data = JSON.parse(fs.readFileSync(filePath, options));
            }

            return data;
        }
        catch (e) {
            return [];
        }
    },

    write(data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data), options);
        }
        catch(e) {
            console.log(e);
        }
        
        return this;
    }
};