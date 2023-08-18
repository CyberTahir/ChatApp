const msgList = document.getElementById('msg-list');
const socket = io.connect("http://localhost:4000");
const msgText = document.getElementById('msg-text');
const usersList = document.getElementById('user-list');

let userData = {
    name: localStorage.getItem('currentUserName')
};
let recipientName;

function sendMessage(e) {
    e.preventDefault();
    let message = msgText.value.trim();

    if (!message)
        return;

    socket.emit('sendMessage', {
        text: message,
        senderData: userData,
        recipientData: {
            name: recipientName
        }
    });

    let msgElem = document.createElement('li');
    msgElem.classList.add("sender-msg");
    msgElem.textContent = message;

    msgList.appendChild(msgElem);
    msgText.value = '';
}

function openDialog(e) {
    let elem = e.target;

    if (elem.tagName === 'P') {
        recipientName = elem.textContent;

        socket.emit('joinRoom', {
            senderData: userData,
            recipientData: {
                name: recipientName
            },
            roomID: 'kekw'
        });
    }
}

if (userData.name === undefined) {
    window.location.replace('/');
}
else {
    socket.emit('regUser', userData);
}

socket.on('requestUsersList', () => {
    socket.emit('getUsersList', userData);
});

socket.on('updateUsersList', ({ html, user }) => {
    usersList.innerHTML = html;
    userData = user;
});

socket.on('getMessages', data => {
    msgList.innerHTML = data;
});

window.onclose = (e) => {
    socket.emit('disconnect', userData);
};