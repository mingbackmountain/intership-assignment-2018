import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("booking_histories")
export class BookingHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column()
  room_no: string;
  @Column({ name: "is_check_in" })
  isCheckIn: boolean;
  @Column()
  floor: number;
  @Column()
  hotel_id: string;
}
