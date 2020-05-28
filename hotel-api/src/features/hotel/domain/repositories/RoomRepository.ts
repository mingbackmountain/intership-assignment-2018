import { Room } from "../entities/Room";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(Room)
export class RoomRepository extends Repository<Room> {
  public async createRooms(
    hotelId: string,
    floorCount: number,
    roomPerFloorCount: number
  ): Promise<Room[]> {
    const rooms = Array.from({ length: floorCount }, (_, indexFloor) =>
      Array.from({ length: roomPerFloorCount }, (_, indexRoom) => {
        const roomNo = indexRoom + 1;
        const floorNo = indexFloor + 1;
        return this.create({
          no: floorNo.toString() + roomNo.toString().padStart(2, "0"),
          floor: floorNo,
          isBooked: false,
          hotelId: hotelId
        });
      })
    ).flat();

    await this.save(rooms);

    return rooms;
  }

  public async book(room: Room) {
    room.isBooked = true;

    await this.save(room);

    return room;
  }

  public async unbook(room: Room) {
    room.isBooked = false;

    await this.save(room);

    return room;
  }

  public async getRoomByFloor(hotelId: string, floor: number): Promise<Room[]> {
    const rooms = await this.find({
      floor: floor,
      hotelId: hotelId
    });

    return rooms;
  }

  public async getRoomByNo(hotelId: string, roomNo: string): Promise<Room> {
    return await this.findOneOrFail({
      no: roomNo,
      hotelId: hotelId
    });
  }

  public async availableRooms(hotelId: string): Promise<Room[]> {
    return this.find({
      where: { hotelId: hotelId, isBooked: false },
      order: { no: "ASC" }
    });
  }
}
