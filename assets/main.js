const msgList = document.getElementById('msg-list');
const msgText = document.getElementById('msg-text');
const usersList = document.getElementById('user-list');

let socket = io("http://localhost:4000", {
    query: {
        roomID: 'kekw'
    }
});

let currentUser = {
    name: localStorage.getItem('currentUserName')
};

socket.emit('user:add', currentUser);
socket.on('users', ({ html, user }) => {
    usersList.innerHTML = html;
    currentUser = user;
});

function openDialog(event) {
    let elem = event.target;

    if (elem.tagName === 'P') {
        socket.emit('message:get', currentUser);
    }
}

socket.on('messages', (data) => {
    msgList.innerHTML = data;
});

function sendMessage(event) {
    event.preventDefault();
    console.log(event);
}