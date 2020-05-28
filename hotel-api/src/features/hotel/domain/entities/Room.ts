import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("rooms")
export class Room {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  no: string;
  @Column()
  floor: number;
  @Column({ name: "is_booked" })
  isBooked: boolean;
  @Column({ name: "hotel_id" })
  hotelId: string;
}
