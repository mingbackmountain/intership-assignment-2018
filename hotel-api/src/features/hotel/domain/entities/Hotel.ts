import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("hotels")
export class Hotel {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  floor: number;
  @Column()
  room_per_floor: number;
}
