import { EntityRepository, Repository } from "typeorm";
import { Hotel } from "../entities/Hotel";

@EntityRepository(Hotel)
export class HotelRepository extends Repository<Hotel> {
  public async createHotel(floorCount: number, roomPerFloorCount: number) {
    const hotel = this.create({
      floor: floorCount,
      room_per_floor: roomPerFloorCount
    });

    await this.save(hotel);

    return hotel.id.toString();
  }
}
