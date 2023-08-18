const fs = require('fs');

function getRoomID(sender, recipient) {
    let firstId, secondId;

    if (sender.id > recipient.id) {
        firstId = recipient.id;
        secondId = sender.id;
    }
    else {
        firstId = sender.id;
        secondId = recipient.id;
    }

    return `${firstId}_${secondId}`;
}

module.exports = {
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

    getMessages(userData, roomData) {
        let fileName = roomData.type === 'personal' ?
                getRoomID(userData, roomData.recipient)
                : roomData.id;
        let msgFilePath = `./messages/${fileName}.json`;

        return fs.existsSync(msgFilePath) ? JSON.parse(fs.readFileSync(msgFilePath, 'utf8')) : [];
    }
}