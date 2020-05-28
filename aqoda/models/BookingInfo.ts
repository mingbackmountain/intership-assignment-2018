import { Room } from "./Room";
import { CustomerInfo } from "./CustomerInfo";

class BookingInfo {
  room: Room;
  customerInfo: CustomerInfo;
  keycardId: string;
  constructor(room: Room, customerInfo: CustomerInfo, keycardId: string) {
    this.room = room;
    this.customerInfo = customerInfo;
    this.keycardId = keycardId;
  }
}

export { BookingInfo };
