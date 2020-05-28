import { BookingHistory } from "../entities/BookingHistory";
import { Room } from "../entities/Room";
import { Guest } from "../entities/Guest";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(BookingHistory)
export class BookingHistoryRepository extends Repository<BookingHistory> {
  public async createBookingHistories(
    hotelId: string,
    rooms: Room[],
    guest: Guest
  ): Promise<BookingHistory[]> {
    const bookingHistories = await Promise.all(
      rooms.map(room => {
        return this.createBookingHistory(hotelId, room, guest);
      })
    );
    return bookingHistories;
  }
  public async getBookingHistoryByRoomNo(
    hotelId: string,
    roomNo: string
  ): Promise<BookingHistory> {
    return await this.findOneOrFail({
      room_no: roomNo,
      hotel_id: hotelId
    });
  }

  public async createBookingHistory(
    hotelId: string,
    room: Room,
    guest: Guest
  ): Promise<BookingHistory> {
    const bookingHistory = this.create({
      name: guest.name,
      age: guest.age,
      room_no: room.no,
      isCheckIn: false,
      floor: room.floor,
      hotel_id: hotelId
    });

    return bookingHistory;
  }

  public async checkIn(bookingHistory: BookingHistory) {
    bookingHistory.isCheckIn = true;

    await this.save(bookingHistory);

    return bookingHistory;
  }

  public async listBookingHistories() {
    const bookingHistories = await this.find();

    return bookingHistories;
  }

  public async clearBookingHistory(hotelId: string, roomNo: string) {
    const bookingHistories = await this.listBookingHistories();
    const deletBookingHistories = bookingHistories.filter(
      bookingHistory =>
        bookingHistory.room_no === roomNo && bookingHistory.hotel_id === hotelId
    );

    this.remove(deletBookingHistories);
  }
}
