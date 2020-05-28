import { CheckInHistory } from "../entities/CheckInHistory";
import { KeyCardRepository } from "./KeyCardRepository";
import { KeyCard } from "../entities/KeyCard";
import { BookingHistory } from "../entities/BookingHistory";
import { Guest } from "../entities/Guest";
import { EntityRepository, Repository } from "typeorm";
import { BookingHistoryRepository } from "./BookingHistoryRepository";

@EntityRepository(CheckInHistory)
export class CheckInHistoryRepository extends Repository<CheckInHistory> {
  public async listCheckInHistories(
    hotelId: string
  ): Promise<CheckInHistory[]> {
    const checkInHistories = this.find({ hotel_id: hotelId });

    return checkInHistories;
  }

  public async getGuestInCheckInHistories(hotelId: string): Promise<Guest[]> {
    const checkInHistories = await this.find({ hotel_id: hotelId });
    const guests = checkInHistories.map(
      checkInHistory => new Guest(checkInHistory.name, checkInHistory.age)
    );

    return guests;
  }

  public async clearCheckInHistoryByKeyCardNo(
    hotelId: string,
    keyCardNo: number
  ): Promise<CheckInHistory[]> {
    let checkInHistories = await this.listCheckInHistories(hotelId);
    const removeCheckIn = checkInHistories.filter(checkInHistory => {
      return (
        checkInHistory.keycard_no === keyCardNo &&
        checkInHistory.hotel_id === hotelId
      );
    });

    await this.remove(removeCheckIn);

    return checkInHistories;
  }

  public getCheckInHistoryByKeycard(
    checkInHistories: CheckInHistory[],
    keyCardNo: number
  ): CheckInHistory | undefined {
    return checkInHistories.find(
      checkInHistory => checkInHistory.keycard_no === keyCardNo
    );
  }

  public async getCheckInHistoriesByKeyCardNo(
    hotelId: string,
    keyCardNo: number
  ): Promise<CheckInHistory | undefined> {
    const checkInHistories = await this.listCheckInHistories(hotelId);
    return await checkInHistories.find(
      checkInHistory => checkInHistory.keycard_no === keyCardNo
    );
  }

  public async getCheckInHistoriesByGuestName(
    hotelId: string,
    guestName: string
  ): Promise<CheckInHistory[]> {
    const checkInHistories = await this.listCheckInHistories(hotelId);
    return checkInHistories.filter(
      checkInHistory => checkInHistory.name === guestName
    );
  }

  public async getCheckInHistoriesByFloor(
    hotelId: string,
    floor: number
  ): Promise<CheckInHistory[]> {
    const checkInHistories = await this.listCheckInHistories(hotelId);
    return checkInHistories.filter(
      checkInHistory => checkInHistory.floor === floor
    );
  }

  public getRoomNosFromCheckInHistories(
    checkInHistories: CheckInHistory[]
  ): string[] {
    return checkInHistories.map(checkInHistory => checkInHistory.room_no);
  }
  public async getGuestByRoomNo(
    hotelId: string,
    roomNo: string
  ): Promise<Guest> {
    const guest = await this.getGuestByCondition(
      hotelId,
      checkInHistory => checkInHistory.room_no === roomNo
    );
    return guest[0];
  }

  public async getGuestByCondition(
    hotelId: string,
    condition: (checkInHistory: CheckInHistory) => boolean | undefined
  ): Promise<Guest[]> {
    const checkInHistories = await this.listCheckInHistories(hotelId);
    const guests = checkInHistories
      .filter(condition)
      .map(
        checkInHistory => new Guest(checkInHistory.name, checkInHistory.age)
      );

    return guests;
  }

  public createCheckInHistory(
    hotelId: string,
    bookingHistory: BookingHistory,
    guest: Guest,
    keyCard: KeyCard
  ): CheckInHistory {
    const checkInHistory = this.create({
      name: guest.name,
      age: guest.age,
      room_no: bookingHistory.room_no,
      floor: bookingHistory.floor,
      hotel_id: hotelId,
      keycard_no: keyCard.no
    });

    return checkInHistory;
  }

  public async createCheckInHistories(
    hotelId: string,
    bookingHistories: BookingHistory[],
    guest: Guest,
    keyCardManager: KeyCardRepository,
    bookingHistoryManager: BookingHistoryRepository
  ): Promise<CheckInHistory[]> {
    const keycards = await keyCardManager.borrowKeyCards(
      hotelId,
      bookingHistories.length
    );
    const checkInHistories = await Promise.all(
      bookingHistories.map(async (bookingHistory, index) => {
        const bookingHistoryCheckIn = await bookingHistoryManager.checkIn(
          bookingHistory
        );
        const checkInHistory: CheckInHistory = await this.createCheckInHistory(
          hotelId,
          bookingHistoryCheckIn,
          guest,
          keycards[index]
        );
        await this.save(checkInHistory);
        return checkInHistory;
      })
    );
    return checkInHistories;
  }

  public isGuestCheckedIn(
    checkInHistory: CheckInHistory[] | CheckInHistory | undefined
  ): boolean {
    return checkInHistory !== undefined;
  }
}
