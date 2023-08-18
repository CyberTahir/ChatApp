module.exports = {
    userToHTML(user, sender) {
        let text = user.name;
        let classes = '';

        if (user.name === sender.name) {
            classes += 'current';
        }

        if (user.isActive) {
            classes += ' active';
        }

        return `<p class="${classes}">${text}</p>`;
    },

    messageToHTML(msg, sender) {
        let cls = (sender.id === msg.senderId ? "sender" : "recipient") + "-msg";
        return `<li class="${cls}">${msg.text}</li>`;
    }
};