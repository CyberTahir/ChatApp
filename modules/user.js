class User {
    constructor(name, id, isActive = false, socketID = null) {
        this.name = name;
        this.id = id;
        this.isActive = isActive;
        this.socketID = socketID;
    }
}

module.exports = { User };