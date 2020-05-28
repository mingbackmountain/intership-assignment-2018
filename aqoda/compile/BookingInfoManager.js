"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { getBookingInfos, setBookingInfos } = require("./db");
class BookingInfoManager {
    constructor() {
        setBookingInfos([]);
    }
    get bookingInfos() {
        return getBookingInfos();
    }
    recordBookingInfo(bookingInfo) {
        const bookingInfoRecord = [...this.bookingInfos, bookingInfo];
        setBookingInfos(bookingInfoRecord);
        return bookingInfo;
    }
    removeBookingInfo(checkoutBookingInfo) {
        const removeBookingInfo = this.bookingInfos.filter((bookingInfo) => bookingInfo.keycardId !== checkoutBookingInfo.keycardId);
        setBookingInfos(removeBookingInfo);
    }
    getBookingInfoByName(name) {
        return this.bookingInfos.find((bookingInfo) => bookingInfo.customerInfo.name === name);
    }
    getBookingInfoByKeycardId(keycardId) {
        return this.bookingInfos.find((bookingInfo) => bookingInfo.keycardId === keycardId);
    }
}
exports.BookingInfoManager = BookingInfoManager;
