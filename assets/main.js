const msgList = document.getElementById('message-list');
const msgText = document.getElementById('message-field');
const form = document.getElementById('message-form');
const usersList = document.getElementById('user-list');
const roomsList = document.getElementById('room-list');
const roomInfo = document.getElementById('room-info');

let socket = io("http://localhost:4000");
let currentRoom;

socket.emit('user:join', localStorage.getItem('currentUserName'));
socket.on('request:users', () => {
    socket.emit('user:get');
    socket.emit('room:list');
});
socket.on('users', (html) => {
    usersList.innerHTML = html;

    if (currentRoom) {
        let room = usersList.querySelector(`[data-room-id="${currentRoom.id}"]`);
        let status = room.classList.contains('active') ? 'online' : 'offline';

        let statusElem = roomInfo.querySelector('.status');
        statusElem.textContent = status;
        statusElem.classList.add(status);
    }
});
socket.on('rooms', (html) => {
    roomsList.innerHTML = html;
});

function setRoomInfo(room) {
    let roomName = document.createElement('p');
    roomName.classList.add('room-name');
    roomName.textContent = room.name;

    let onlineStatus = document.createElement('p');
    onlineStatus.classList.add('status');

    if (room.type === 'private') {
        let status = room.online ? 'online' : 'offline';
        onlineStatus.classList.add(status);
        onlineStatus.textContent = status;
        msgList.classList.remove('public');
    }
    else {
        onlineStatus.textContent = 'public chat';
        msgList.classList.add('public');
    }

    roomInfo.innerHTML = '';
    roomInfo.append(roomName, onlineStatus);
    currentRoom = room;
}

function openDialog(event) {
    let elem = event.target;

    if (elem.tagName !== 'LI') {
        return;
    }

    let room = {
        type: elem.dataset.roomType,
        id: elem.dataset.roomId
    };

    socket.emit('room:leave');
    socket.emit('room:join', room);
    socket.emit('message:get');

    if (!elem.classList.contains('current')) {
        setRoomInfo({
            name: elem.innerHTML,
            type: room.type,
            id: room.id,
            online: elem.classList.contains('active')
        });
        roomJoined = true;
    }
}

socket.on('request:message', () => {
    socket.emit('message:get');
});
socket.on('messages', (data) => {
    msgList.innerHTML = data;
    msgList.scrollTop = msgList.scrollHeight;
});

function sendMessage(event) {
    event.preventDefault();

    if (!currentRoom) {
        return;
    }

    let message = msgText.value;
    msgText.value = '';

    let messageElement = document.createElement('li');
    messageElement.innerHTML = message;
    messageElement.classList.add('sender-message');

    socket.emit('message:add', message);
    msgList.appendChild(messageElement);
    msgText.focus();
}

function leaveChat() {
    socket.emit('room:leave');
    msgList.innerHTML = '';
    roomInfo.innerHTML = '';
    currentRoom = undefined;
}

form.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage(event);
    }
});