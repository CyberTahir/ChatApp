const fs = require('fs');

module.exports = {
    getMsgFilePath(sender, recipient) {
        let firstId, secondId;

        if (sender.id > recipient.id) {
            firstId = recipient.id;
            secondId = sender.id;
        }
        else {
            firstId = sender.id;
            secondId = recipient.id;
        }

        return `./messages/${firstId}_${secondId}.json`;
    },

    saveMessage(msg, sender, recipient) {
        let msgFilePath = this.getMsgFilePath(sender, recipient);
        let output = {
            senderId: sender.id,
            text: msg
        };

        if (!fs.existsSync(msgFilePath)) {
            fs.writeFile(msgFilePath, '[\n\t' + JSON.stringify(output) + '\n]', console.log);
        }
        else {
            let fileSize = fs.statSync(msgFilePath).size;
            if (fileSize <= 2) {
                fs.writeFile(msgFilePath, '[\n\t' + JSON.stringify(output) + '\n]', console.log);
            }
            else {
                fs.truncate(msgFilePath, fileSize - 2, () => 
                    fs.appendFile(msgFilePath, ',\n\t' + JSON.stringify(output) + '\n]', console.log)
                );
            }
        }
    },

    getMessages(sender, recipient) {
        let msgFilePath = this.getMsgFilePath(sender, recipient);
        return fs.existsSync(msgFilePath) ? fs.readFileSync(msgFilePath, 'utf8') : '[]';
    }
}