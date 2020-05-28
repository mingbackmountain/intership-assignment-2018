"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Room {
    constructor(id, floorNumber) {
        this.id = id;
        this.floorNumber = floorNumber;
        this.isAvailable = true;
    }
    book() {
        this.isAvailable = false;
    }
    checkout() {
        this.isAvailable = true;
    }
}
exports.Room = Room;
