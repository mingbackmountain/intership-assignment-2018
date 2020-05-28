import { BookingInfo } from "./models/BookingInfo";

const { getBookingInfos, setBookingInfos } = require("./db");
class BookingInfoManager {
  constructor() {
    setBookingInfos([]);
  }

  get bookingInfos() {
    return getBookingInfos();
  }

  recordBookingInfo(bookingInfo: BookingInfo) {
    const bookingInfoRecord = [...this.bookingInfos, bookingInfo];
    setBookingInfos(bookingInfoRecord);
    return bookingInfo;
  }

  removeBookingInfo(checkoutBookingInfo: BookingInfo) {
    const removeBookingInfo = this.bookingInfos.filter(
      (bookingInfo: BookingInfo) =>
        bookingInfo.keycardId !== checkoutBookingInfo.keycardId
    );
    setBookingInfos(removeBookingInfo);
  }

  getBookingInfoByName(name: string) {
    return this.bookingInfos.find(
      (bookingInfo: BookingInfo) => bookingInfo.customerInfo.name === name
    );
  }

  getBookingInfoByKeycardId(keycardId: string) {
    return this.bookingInfos.find(
      (bookingInfo: BookingInfo) => bookingInfo.keycardId === keycardId
    );
  }
}

export { BookingInfoManager };
