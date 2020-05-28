import { KeycardManager } from "./KeycardManager";
import { BookingInfoManager } from "./BookingInfoManager";
import { RoomManager } from "./RoomManager";
import { Hotel } from "./models/Hotel";
import { BookingInfo } from "./models/BookingInfo";
import { Room } from "./models/Room";
import { CustomerInfo } from "./models/CustomerInfo";

class HotelApplication {
  hotel?: Hotel;
  keycardManager?: KeycardManager;
  bookingInfoManager?: BookingInfoManager;
  roomManager?: RoomManager;

  createHotel(floorCount: string, roomCount: string): void {
    this.hotel = new Hotel();
    this.roomManager = new RoomManager(
      parseInt(floorCount),
      parseInt(roomCount)
    );
    this.keycardManager = new KeycardManager(
      this.roomManager!.totalNumberOfRoom
    );
    this.bookingInfoManager = new BookingInfoManager();
  }

  book(roomId: string, customerInfo: CustomerInfo): BookingInfo {
    try {
      const room = this.roomManager!.getRoomByRoomId(roomId);
      const keycard = this.keycardManager!.getAvailableKeycard();
      const bookingInfo = this.hotel!.bookRoom(
        room!,
        customerInfo,
        keycard!.id
      );
      this.keycardManager!.assignKeycard(keycard!, room!.id);

      throw new Error(
        `Cannot book room ${roomId} for ${
          customerInfo.name
        }, The room is currently booked by ${this.getGuestNameByRoomId(
          roomId
        )}.`
      );
    }
  }

  checkout(keycardId: string, name: string): BookingInfo {
    const keycard = this.keycardManager!.getKeycardById(keycardId);
    const bookingInfo = this.bookingInfoManager!.getBookingInfoByKeycardId(
      keycard!.id
    );
    const checkoutBookingInfo = this.hotel!.checkoutRoom(name, bookingInfo);

    this.keycardManager!.dischargeKeycard(keycard!);
    this.bookingInfoManager!.removeBookingInfo(checkoutBookingInfo);

    return checkoutBookingInfo;
  }

  bookByFloorNumber(floorNumber: string, customerInfo: CustomerInfo) {
    if (!this.isFloorAvailable(floorNumber))
      throw new Error(
        `Cannot book floor ${floorNumber} for ${customerInfo.name}`
      );

    const availableRoomsOnFloor = this.roomManager!.getAvailableRoomsByFloor(
      floorNumber
    );
    const keycards = this.keycardManager!.getAllAvailableKeycard();
    const keycardIds = keycards.map(keycard => keycard.id);

    this.zip(availableRoomsOnFloor, keycards).forEach(([room, keycard]) => {
      this.keycardManager!.assignKeycard(keycard, room.id);
    });

    return this.hotel!.bookByFloorNumber(
      availableRoomsOnFloor,
      customerInfo,
      keycardIds
    );
  }

  checkoutByFloorNumber(floorNumber: string): string[] {
    const rooms = this.roomManager!.getAllBookedRoomByFloorNumber(floorNumber);
    const roomIds = rooms.map(room => room.id);
    const bookingInfos = this.getBookingInfosByFloor(floorNumber);
    const guestNames = bookingInfos.map(
      bookingInfo => bookingInfo.customerInfo.name
    );

    this.hotel!.checkoutByFloorNumber(guestNames, bookingInfos);

    return roomIds;
  }

  getAvailableRooms(): Room[] {
    return this.roomManager!.getAllAvailableRooms();
  }

  getAllGuestNames(): string[] {
    return this.bookingInfoManager!.bookingInfos.map(
      (bookingInfo: BookingInfo) => bookingInfo.customerInfo.name
    );
  }

  getGuestNameByRoomId(roomId: string): string {
    return this.bookingInfoManager!.bookingInfos.find(
      (bookingInfo: BookingInfo) => bookingInfo.room.id === roomId.toString()
    ).customerInfo.name;
  }

  getGuestNamesByAge(sign: string, age: number): string[] {
    const customerInfos = this.bookingInfoManager!.bookingInfos.map(
      (bookingInfo: BookingInfo) => bookingInfo.customerInfo
    );
    const guestNames = customerInfos
      .filter((customerInfo: CustomerInfo) => {
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
      .map((customerInfo: CustomerInfo) => customerInfo.name);

    return guestNames;
  }

  getGuestsByFloorNumber(floorNumber: string): CustomerInfo[] {
    return this.bookingInfoManager!.bookingInfos.filter(
      (bookingInfo: BookingInfo) => {
        return bookingInfo.room.floorNumber === floorNumber;
      }
    ).map((bookingInfo: BookingInfo) => bookingInfo.customerInfo);
  }

  isFloorAvailable(floorNumber: string): boolean {
    return (
      this.roomManager!.getAllBookedRoomByFloorNumber(floorNumber).length === 0
    );
  }

  getBookingInfosByFloor(floorNumber: string): BookingInfo[] {
    return this.bookingInfoManager!.bookingInfos.filter(
      (bookingInfo: BookingInfo) => bookingInfo.room.floorNumber === floorNumber
    );
  }

  zip<T, G>(a: T[], b: G[]): [T, G][] {
    let c = [];
    for (let i = 0; i < a.length; i++) {
      c.push([a[i], b[i]]);
    }
    return c as any;
  }
}

export { HotelApplication };
