import { Room } from "./models/Room";
import { Keycard } from "./models/Keycard";
import { BookingInfo } from "./models/BookingInfo";

let rooms: Room[][] = [];
let keycards: Keycard[] = [];
let bookingInfos: BookingInfo[] = [];

export const setRooms = (room: Room[][]) => (rooms = room);
export const setKeycards = (keycard: Keycard[]) => (keycards = keycard);
export const setBookingInfos = (bookingInfo: BookingInfo[]) =>
  (bookingInfos = bookingInfo);

export const getRooms = () => {
  return rooms;
};
export const getKeycards = () => {
  return keycards;
};
export const getBookingInfos = () => {
  return bookingInfos;
};
