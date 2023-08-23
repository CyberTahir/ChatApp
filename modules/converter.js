module.exports = {
    userToHTML(user, sender) {
        let text = user.name;
        let htmlStart = `<li data-room-type='private' data-room-id='${user.id}'`;
        let htmlEnd = '>' + text + '</li>';
        let classes = '';

        if (user.name === sender.name) {
            classes += 'current';
        }

        if (user.isActive) {
            classes += ' active';
        }

        return htmlStart + (classes === '' ? '' : `class='${classes.trim()}'`) + htmlEnd;
    },

    messageToHTML(msg, sender) {
        let cls = (sender.id === msg.senderID ? "sender" : "recipient") + "-msg";
        return `<li class="${cls}">${msg.messageText}</li>`;
    },

    roomToHTML(room) {
        return `<li data-room-type='public' data-room-id='${room}'>${room}</li>`;
    }
};