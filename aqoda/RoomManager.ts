import { Room } from "./models/Room";
import { setRooms, getRooms } from "./db";

class RoomManager {
  constructor(floorCount: number, roomCount: number) {
    setRooms(this.createRooms(floorCount, roomCount));
  }

  get rooms() {
    return getRooms();
  }

  get totalNumberOfRoom() {
    return this.rooms.flat().length;
  }

  getRoomByRoomId(roomId: string) {
    return this.rooms.flat().find(room => room.id === roomId);
  }

  getAllAvailableRooms() {
    return this.rooms.flat().filter(room => room.isAvailable);
  }

  getAllBookedRoomByFloorNumber(floorNumber: string) {
    return this.rooms
      .flat()
      .filter(room => !room.isAvailable && room.floorNumber === floorNumber);
  }

  getAvailableRoomsByFloor(floorNumber: string) {
    return this.rooms
      .flat()
      .filter(room => room.isAvailable && room.floorNumber === floorNumber);
  }

  createRooms(floorCount: number, roomCount: number) {
    return this.range(1, floorCount).map(floorNumber =>
      this.range(1, roomCount).map(roomNumber => {
        const roomId: string =
          floorNumber + roomNumber.toString().padStart(2, "0");
        return new Room(roomId, floorNumber.toString());
      })
    );
  }

  range(startAt = 0, size: number) {
    return [...Array(size).keys()].map(i => i + startAt);
  }
}

export { RoomManager };
