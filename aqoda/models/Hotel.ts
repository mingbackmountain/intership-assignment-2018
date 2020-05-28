import { BookingInfo } from "./BookingInfo";
import { Room } from "./Room";
import { CustomerInfo } from "./CustomerInfo";

class Hotel {
  bookRoom(room: Room, customerInfo: CustomerInfo, keycardId: string) {
    if (!room.isAvailable) throw new Error("room is not available");

    const bookingInfo = new BookingInfo(room, customerInfo, keycardId);
    bookingInfo.room.book();

    return bookingInfo;
  }

  checkoutRoom(name: string, bookingInfo: BookingInfo) {
    const guestNameInRoom = bookingInfo.customerInfo.name;

    if (!this.canCheckoutRoom(guestNameInRoom, name)) {
      const keycardIdInRoom = bookingInfo.keycardId;
      throw new Error(
        `Only ${guestNameInRoom} can checkout  with keycard number ${keycardIdInRoom}.`
      );
    }

    bookingInfo.room.checkout();

    return bookingInfo;
  }

  checkoutByFloorNumber(guestNames: string[], bookingInfos: BookingInfo[]) {
    this.zip<string, BookingInfo>(guestNames, bookingInfos).forEach(
      ([guestName, bookingInfo]) => {
        this.checkoutRoom(guestName, bookingInfo);
      }
    );
  }

  bookByFloorNumber(
    availableRoomsOnFloor: Room[],
    customerInfo: CustomerInfo,
    keycardIds: string[]
  ): { bookedRoomIds: string; keycardIds: string }[] {
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

  canCheckoutRoom(guestNameInRoom: string, name: string) {
    return guestNameInRoom === name;
  }

  zip<T, G>(a: T[], b: G[]): [T, G][] {
    let c = [];
    for (let i = 0; i < a.length; i++) {
      c.push([a[i], b[i]]);
    }
    return c as any;
  }
}

export { Hotel };
