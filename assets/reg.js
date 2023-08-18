const form = document.querySelector('form');
const nameField = document.querySelector('form input');

const sendForm = (e) => {
    e.preventDefault();

    let name = nameField.value.trim();
    localStorage.setItem('currentUserName', name);
    window.location.replace('/chat');
};