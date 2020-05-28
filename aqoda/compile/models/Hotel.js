"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BookingInfo_1 = require("./BookingInfo");
class Hotel {
    bookRoom(room, customerInfo, keycardId) {
        if (!room.isAvailable)
            throw new Error("room is not available");
        const bookingInfo = new BookingInfo_1.BookingInfo(room, customerInfo, keycardId);
        bookingInfo.room.book();
        return bookingInfo;
    }
    checkoutRoom(name, bookingInfo) {
        const guestNameInRoom = bookingInfo.customerInfo.name;
        if (!this.canCheckoutRoom(guestNameInRoom, name)) {
            const keycardIdInRoom = bookingInfo.keycardId;
            throw new Error(`Only ${guestNameInRoom} can checkout  with keycard number ${keycardIdInRoom}.`);
        }
        bookingInfo.room.checkout();
        return bookingInfo;
    }
    checkoutByFloorNumber(guestNames, bookingInfos) {
        this.zip(guestNames, bookingInfos).forEach(([guestName, bookingInfo]) => {
            this.checkoutRoom(guestName, bookingInfo);
        });
    }
    bookByFloorNumber(availableRoomsOnFloor, customerInfo, keycardIds) {
        return this.zip(availableRoomsOnFloor, keycardIds)
            .map(([room, keycardId]) => {
            return this.bookRoom(room, customerInfo, keycardId);
        })
            .map(bookingInfo => {
            return {
                bookedRoomIds: bookingInfo.room.id,
                keycardIds: bookingInfo.keycardId
            };
        });
    }
    canCheckoutRoom(guestNameInRoom, name) {
        return guestNameInRoom === name;
    }
    zip(a, b) {
        let c = [];
        for (let i = 0; i < a.length; i++) {
            c.push([a[i], b[i]]);
        }
        return c;
    }
}
exports.Hotel = Hotel;
