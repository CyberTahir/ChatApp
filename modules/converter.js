function intToStr(n) {
    return (n < 10 ? '0' : '') + n;
}

function formatTime(date) {
    let hours = date.getHours();
    let = minutes = date.getMinutes();

    return `${intToStr(hours)}:${intToStr(minutes)}`;
}

function formatDate(date) {
    let day = intToStr(date.getDay());
    let month = intToStr(date.getMonth());
    let year = date.getFullYear();
    
    return `${day}.${month}.${year}`;
}

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

    messageToHTML(message, user, roomType) {
        let isSender = user.id === message.senderID;
        let senderName = isSender ? 'You' : message.senderName;
        let cls = (isSender ? 'sender' : 'recipient') + '-message';
        let date = new Date(Date.parse(message.createdAt));

        let senderNameHTML = roomType === 'public' ? `<p class='sender-name'>${senderName}</p>` : '';
        let timeHTML = `<span class='time'>${formatDate(date)} ${formatTime(date)}</span>`;
        let messageHTML = `<p class='message-text'>${message.messageText}</p>`;


        return `<li class='message-container ${cls}'>
            ${senderNameHTML}
            <div class='message'>
                ${messageHTML}
                ${timeHTML}
            </div>
        </li>`;
    },

    roomToHTML(room) {
        let name = room.match(/(\w+?)\./)[1];
        return `<li data-room-type='public' data-room-id='${name}'>${name}</li>`;
    }
};