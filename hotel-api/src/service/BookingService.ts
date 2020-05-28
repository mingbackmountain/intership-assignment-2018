import { CheckInHistory } from "../features/hotel/domain/entities/CheckInHistory";
import { Guest } from "../features/hotel/domain/entities/Guest";
import { BookingHistory } from "../features/hotel/domain/entities/BookingHistory";
import { BookingHistoryRepository } from "../features/hotel/domain/repositories/BookingHistoryRepository";
import { CheckInHistoryRepository } from "../features/hotel/domain/repositories/CheckInHistoryRepository";
import { KeyCardRepository } from "../features/hotel/domain/repositories/KeyCardRepository";
import { UserRepository } from "../features/authentication/domain/repositories/UserRepository";
import { RoomRepository } from "../features/hotel/domain/repositories/RoomRepository";
import { Room } from "../features/hotel/domain/entities/Room";
import {
  confirmationInfo,
  confirmationInfos
} from "../features/hotel/application/interfaces/Information";
import { HotelRepository } from "../features/hotel/domain/repositories/HotelRepository";
import { getCustomRepository } from "typeorm";
import bcrypt from "bcrypt";

export type Sign = "<" | ">" | "=";

export class BookingService {
  public async createHotel(
    floorCount: number,
    roomPerFloorCount: number,
    email: string,
    password: string
  ) {
    const hotelRepository = getCustomRepository(HotelRepository);
    const keyCardRepository = getCustomRepository(KeyCardRepository);
    const roomRepository = getCustomRepository(RoomRepository);
    const userRepository = getCustomRepository(UserRepository);

    const hotelId = await hotelRepository.createHotel(
      floorCount,
      roomPerFloorCount
    );

    const saltRound = 10;
    const passHash = bcrypt.hashSync(password, saltRound);

    await userRepository.createUser(hotelId, email, passHash);

    await keyCardRepository.createKeyCards(
      hotelId,
      floorCount * roomPerFloorCount
    );

    await roomRepository.createRooms(hotelId, floorCount, roomPerFloorCount);

    return hotelId;
  }

  public async findUser(email: string, password: string) {
    const userRepository = getCustomRepository(UserRepository);
    const user = await userRepository.getUser(email, password);

    return user;
  }

  public async bookAndCheckIn(
    hotelId: string,
    roomNo: string,
    guest: Guest
  ): Promise<confirmationInfo> {
    const roomRepository = getCustomRepository(RoomRepository);
    const bookingHistoryRepository = getCustomRepository(
      BookingHistoryRepository
    );
    const keyCardRepository = getCustomRepository(KeyCardRepository);
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    const room = await roomRepository.getRoomByNo(hotelId, roomNo);

    if (room.isBooked) {
      const bookingHistory = await bookingHistoryRepository.getBookingHistoryByRoomNo(
        hotelId,
        roomNo
      );

      throw new Error(
        `Cannot book room ${roomNo} for ${
          guest.name
        }, The room is currently booked by ${bookingHistory.name}`
      );
    }

    await roomRepository.book(room);
    const bookingHistory = await bookingHistoryRepository.createBookingHistory(
      hotelId,
      room,
      guest
    );

    await bookingHistoryRepository.checkIn(bookingHistory);

    const borrowedKeyCard = await keyCardRepository.borrowKeyCard(hotelId);
    const checkInHistory: CheckInHistory = await checkInHistoryRepository.createCheckInHistory(
      hotelId,
      bookingHistory,
      guest,
      borrowedKeyCard
    );

    await checkInHistoryRepository.save(checkInHistory);

    return { bookingHistory, checkInHistory };
  }

  public async bookByFloorAndCheckIn(
    hotelId: string,
    floor: number,
    guest: Guest
  ): Promise<confirmationInfos> {
    const roomsInFloor: Room[] = await this.getRoomsByFloor(hotelId, floor);
    const isRoomsAllAvaliable: boolean = roomsInFloor.every(
      room => !room.isBooked
    );
    const roomRepository = getCustomRepository(RoomRepository);
    const bookingHistoryRepository = getCustomRepository(
      BookingHistoryRepository
    );
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    const keyCardRepository = getCustomRepository(KeyCardRepository);

    if (!isRoomsAllAvaliable) {
      throw new Error(`Cannot book floor ${floor} for ${guest.name}.`);
    }
    const bookedRoomInFloor = await Promise.all(
      roomsInFloor.map(room => roomRepository.book(room))
    );

    const bookingHistories: BookingHistory[] = await bookingHistoryRepository.createBookingHistories(
      hotelId,
      bookedRoomInFloor,
      guest
    );

    const customerNotCheckIn: BookingHistory[] = bookingHistories.filter(
      bookingHistory => !bookingHistory.isCheckIn
    );
    const isAllRoomsBooked: boolean = customerNotCheckIn.every(
      bookingHistory => bookingHistory.isCheckIn
    );

    if (isAllRoomsBooked) {
      throw new Error(`Guest already booked all rooms in floor.`);
    }

    await Promise.all(
      bookingHistories.map(bookingHistory =>
        bookingHistoryRepository.checkIn(bookingHistory)
      )
    );

    const checkInHistories: CheckInHistory[] = await checkInHistoryRepository.createCheckInHistories(
      hotelId,
      customerNotCheckIn,
      guest,
      keyCardRepository,
      bookingHistoryRepository
    );

    return { bookingHistories, checkInHistories };
  }

  public async checkOutGuestByFloor(
    hotelId: string,
    floor: number
  ): Promise<Room[]> {
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    const roomRepository = getCustomRepository(RoomRepository);
    const checkInHistoryByFloor: CheckInHistory[] = await checkInHistoryRepository.getCheckInHistoriesByFloor(
      hotelId,
      floor
    );

    if (!checkInHistoryRepository.isGuestCheckedIn(checkInHistoryByFloor)) {
      throw new Error("Guest can't checkout rooms by floor");
    }

    const roomNos = checkInHistoryRepository.getRoomNosFromCheckInHistories(
      checkInHistoryByFloor
    );
    const rooms = await Promise.all(
      roomNos.map(no => roomRepository.getRoomByNo(hotelId, no))
    );

    checkInHistoryByFloor.map((checkInHistory, index) => {
      this.clearRoom(hotelId, rooms[index], checkInHistory.keycard_no);
    });

    return rooms;
  }

  public async checkOutRoom(
    hotelId: string,
    guestName: string,
    keyCardNo: number
  ): Promise<{ room: Room }> {
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    const roomRepository = getCustomRepository(RoomRepository);
    const checkInHistories = await checkInHistoryRepository.getCheckInHistoriesByGuestName(
      hotelId,
      guestName
    );

    const checkInHistory = await checkInHistoryRepository.getCheckInHistoryByKeycard(
      checkInHistories,
      keyCardNo
    );

    if (!checkInHistoryRepository.isGuestCheckedIn(checkInHistory)) {
      const currentGuestBookedRoom = await checkInHistoryRepository.getCheckInHistoriesByKeyCardNo(
        hotelId,
        keyCardNo
      );

      throw new Error(
        `Only ${
          currentGuestBookedRoom!.name
        } can checkout with keycard number ${
          currentGuestBookedRoom!.keycard_no
        }.`
      );
    }

    const room = await roomRepository.getRoomByNo(
      hotelId,
      checkInHistory!.room_no
    );

    await this.clearRoom(hotelId, room, keyCardNo);

    return { room: room };
  }

  public async listAvailableRooms(hotelId: string): Promise<Room[] | Room> {
    const roomRepository = getCustomRepository(RoomRepository);
    return await roomRepository.availableRooms(hotelId);
  }

  public async listCheckInGuest(hotelId: string): Promise<Guest[]> {
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    return await checkInHistoryRepository.getGuestInCheckInHistories(hotelId);
  }

  public async listGuestByAge(
    hotelId: string,
    condition: Sign,
    age: number
  ): Promise<Guest[]> {
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    return await checkInHistoryRepository.getGuestByCondition(
      hotelId,
      checkInHistory => {
        switch (condition) {
          case "<":
            return checkInHistory.age < age;
          case ">":
            return checkInHistory.age > age;
          case "=":
            return checkInHistory.age === age;
          default:
            return;
        }
      }
    );
  }

  public async getGuestInRoom(hotelId: string, roomNo: string): Promise<Guest> {
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    const guest = await checkInHistoryRepository.getGuestByRoomNo(
      hotelId,
      roomNo
    );
    if (guest === undefined) throw new Error("guest not found");
    return guest;
  }

  public async listGuest(hotelId: string): Promise<Guest[]> {
    return await this.listCheckInGuest(hotelId);
  }

  public async listGuestByFloor(
    hotelId: string,
    floor: string
  ): Promise<Guest[]> {
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    return await checkInHistoryRepository.getGuestByCondition(
      hotelId,
      checkInHistory => checkInHistory.floor === parseInt(floor)
    );
  }

  private async clearRoom(
    hotelId: string,
    room: Room,
    keyCardNo: number
  ): Promise<void> {
    const keyCardRepository = getCustomRepository(KeyCardRepository);
    const roomRepository = getCustomRepository(RoomRepository);
    const checkInHistoryRepository = getCustomRepository(
      CheckInHistoryRepository
    );
    const bookingHistoryRepository = getCustomRepository(
      BookingHistoryRepository
    );
    await roomRepository.unbook(room);
    await keyCardRepository.returnKeyCard(hotelId, keyCardNo);
    await checkInHistoryRepository.clearCheckInHistoryByKeyCardNo(
      hotelId,
      keyCardNo
    );
    await bookingHistoryRepository.clearBookingHistory(hotelId, room.no);
  }

  private async getRoomsByFloor(
    hotelId: string,
    floor: number
  ): Promise<Room[]> {
    const roomRepository = getCustomRepository(RoomRepository);
    const rooms = await roomRepository.getRoomByFloor(hotelId, floor);

    return rooms;
  }
}

export const bookingService = new BookingService();
