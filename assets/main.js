const msgList = document.getElementById('msg-list');
const msgText = document.getElementById('msg-text');
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
    roomName.classList.add('name');
    roomName.textContent = room.name;

    let onlineStatus = document.createElement('p');
    onlineStatus.classList.add('status');

    if (room.type === 'private') {
        let status = room.online ? 'online' : 'offline';
        onlineStatus.classList.add(status);
        onlineStatus.textContent = status;
    }
    else {
        onlineStatus.textContent = 'public chat';
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

    setRoomInfo({
        name: elem.innerHTML,
        type: room.type,
        id: room.id,
        online: elem.classList.contains('active')
    });
    roomJoined = true;
}

socket.on('request:message', () => {
    socket.emit('message:get');
});
socket.on('messages', (data) => {
    msgList.innerHTML = data;
});

function sendMessage(event) {
    event.preventDefault();

    if (!roomJoined) {
        return;
    }

    let msg = msgText.value;
    msgText.value = '';

    let msgElement = document.createElement('li');
    msgElement.innerHTML = msg;
    msgElement.classList.add('sender-msg');

    socket.emit('message:add', msg);
    msgList.appendChild(msgElement);
    msgText.focus();
}

function leaveChat() {
    socket.emit('room:leave');
    currentRoom = undefined;
}