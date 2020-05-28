"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let rooms = [];
let keycards = [];
let bookingInfos = [];
exports.setRooms = (room) => (rooms = room);
exports.setKeycards = (keycard) => (keycards = keycard);
exports.setBookingInfos = (bookingInfo) => (bookingInfos = bookingInfo);
exports.getRooms = () => {
    return rooms;
};
exports.getKeycards = () => {
    return keycards;
};
exports.getBookingInfos = () => {
    return bookingInfos;
};
