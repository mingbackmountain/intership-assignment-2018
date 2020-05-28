"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Room_1 = require("./models/Room");
const db_1 = require("./db");
class RoomManager {
    constructor(floorCount, roomCount) {
        db_1.setRooms(this.createRooms(floorCount, roomCount));
    }
    get rooms() {
        return db_1.getRooms();
    }
    get totalNumberOfRoom() {
        return this.rooms.flat().length;
    }
    getRoomByRoomId(roomId) {
        return this.rooms.flat().find(room => room.id === roomId);
    }
    getAllAvailableRooms() {
        return this.rooms.flat().filter(room => room.isAvailable);
    }
    getAllBookedRoomByFloorNumber(floorNumber) {
        return this.rooms
            .flat()
            .filter(room => !room.isAvailable && room.floorNumber === floorNumber);
    }
    getAvailableRoomsByFloor(floorNumber) {
        return this.rooms
            .flat()
            .filter(room => room.isAvailable && room.floorNumber === floorNumber);
    }
    createRooms(floorCount, roomCount) {
        return this.range(1, floorCount).map(floorNumber => this.range(1, roomCount).map(roomNumber => {
            const roomId = floorNumber + roomNumber.toString().padStart(2, "0");
            return new Room_1.Room(roomId, floorNumber.toString());
        }));
    }
    range(startAt = 0, size) {
        return [...Array(size).keys()].map(i => i + startAt);
    }
}
exports.RoomManager = RoomManager;
