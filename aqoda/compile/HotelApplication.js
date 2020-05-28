"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const KeycardManager_1 = require("./KeycardManager");
const BookingInfoManager_1 = require("./BookingInfoManager");
const RoomManager_1 = require("./RoomManager");
const Hotel_1 = require("./models/Hotel");
class HotelApplication {
    createHotel(floorCount, roomCount) {
        this.hotel = new Hotel_1.Hotel();
        this.roomManager = new RoomManager_1.RoomManager(parseInt(floorCount), parseInt(roomCount));
        this.keycardManager = new KeycardManager_1.KeycardManager(this.roomManager.totalNumberOfRoom);
        this.bookingInfoManager = new BookingInfoManager_1.BookingInfoManager();
    }
    book(roomId, customerInfo) {
        try {
            const room = this.roomManager.getRoomByRoomId(roomId);
            const keycard = this.keycardManager.getAvailableKeycard();
            const bookingInfo = this.hotel.bookRoom(room, customerInfo, keycard.id);
            this.keycardManager.assignKeycard(keycard, room.id);
            return this.bookingInfoManager.recordBookingInfo(bookingInfo);
        }
        catch (err) {
            throw new Error(`Cannot book room ${roomId} for ${customerInfo.name}, The room is currently booked by ${this.getGuestNameByRoomId(roomId)}.`);
        }
    }
    checkout(keycardId, name) {
        const keycard = this.keycardManager.getKeycardById(keycardId);
        const bookingInfo = this.bookingInfoManager.getBookingInfoByKeycardId(keycard.id);
        const checkoutBookingInfo = this.hotel.checkoutRoom(name, bookingInfo);
        this.keycardManager.dischargeKeycard(keycard);
        this.bookingInfoManager.removeBookingInfo(checkoutBookingInfo);
        return checkoutBookingInfo;
    }
    bookByFloorNumber(floorNumber, customerInfo) {
        if (!this.isFloorAvailable(floorNumber))
            throw new Error(`Cannot book floor ${floorNumber} for ${customerInfo.name}`);
        const availableRoomsOnFloor = this.roomManager.getAvailableRoomsByFloor(floorNumber);
        const keycards = this.keycardManager.getAllAvailableKeycard();
        const keycardIds = keycards.map(keycard => keycard.id);
        this.zip(availableRoomsOnFloor, keycards).forEach(([room, keycard]) => {
            this.keycardManager.assignKeycard(keycard, room.id);
        });
        return this.hotel.bookByFloorNumber(availableRoomsOnFloor, customerInfo, keycardIds);
    }
    checkoutByFloorNumber(floorNumber) {
        const rooms = this.roomManager.getAllBookedRoomByFloorNumber(floorNumber);
        const roomIds = rooms.map(room => room.id);
        const bookingInfos = this.getBookingInfosByFloor(floorNumber);
        const guestNames = bookingInfos.map(bookingInfo => bookingInfo.customerInfo.name);
        this.hotel.checkoutByFloorNumber(guestNames, bookingInfos);
        return roomIds;
    }
    getAvailableRooms() {
        return this.roomManager.getAllAvailableRooms();
    }
    getAllGuestNames() {
        return this.bookingInfoManager.bookingInfos.map((bookingInfo) => bookingInfo.customerInfo.name);
    }
    getGuestNameByRoomId(roomId) {
        return this.bookingInfoManager.bookingInfos.find((bookingInfo) => bookingInfo.room.id === roomId.toString()).customerInfo.name;
    }
    getGuestNamesByAge(sign, age) {
        const customerInfos = this.bookingInfoManager.bookingInfos.map((bookingInfo) => bookingInfo.customerInfo);
        const guestNames = customerInfos
            .filter((customerInfo) => {
            switch (sign) {
                case "<": {
                    return parseInt(customerInfo.age) < age;
                }
                case ">": {
                    return parseInt(customerInfo.age) > age;
                }
                case "=": {
                    return parseInt(customerInfo.age) === age;
                }
            }
        })
            .map((customerInfo) => customerInfo.name);
        return guestNames;
    }
    getGuestsByFloorNumber(floorNumber) {
        return this.bookingInfoManager.bookingInfos.filter((bookingInfo) => {
            return bookingInfo.room.floorNumber === floorNumber;
        }).map((bookingInfo) => bookingInfo.customerInfo);
    }
    isFloorAvailable(floorNumber) {
        return (this.roomManager.getAllBookedRoomByFloorNumber(floorNumber).length === 0);
    }
    getBookingInfosByFloor(floorNumber) {
        return this.bookingInfoManager.bookingInfos.filter((bookingInfo) => bookingInfo.room.floorNumber === floorNumber);
    }
    zip(a, b) {
        let c = [];
        for (let i = 0; i < a.length; i++) {
            c.push([a[i], b[i]]);
        }
        return c;
    }
}
exports.HotelApplication = HotelApplication;
