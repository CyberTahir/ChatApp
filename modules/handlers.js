const um = require('./users_manager');
const mm = require('./message_manager');

function handleNewMessage({ text, senderData, recipientData }) {
    let sender = um.getUser(senderData);
    let recipient = um.getUser(recipientData);
    mm.saveMessage(text, sender, recipient);
}

function handleRegUser(userData) {
    let user = um.getUser(userData) || um.addNewUser(userData);
    user.socketID = userData.socketID;
    user.isActive = true;

    return user;
}

function handleDisconnect(userData) {
    let user = um.getUser(userData);
    if (user) {
        user.isActive = false;
        user.socketID = null;
    }
}

module.exports = { handleRegUser, handleNewMessage, handleDisconnect, handleJoinRoom };