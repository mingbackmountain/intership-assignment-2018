import { PrimaryGeneratedColumn, Column, Entity } from "typeorm";

@Entity("check_in_histories")
export class CheckInHistory {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column()
  age: number;
  @Column()
  room_no: string;
  @Column()
  floor: number;
  @Column()
  hotel_id: string;
  @Column()
  keycard_no: number;
}
