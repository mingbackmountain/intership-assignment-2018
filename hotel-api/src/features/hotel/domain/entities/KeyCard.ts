import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity("keycards")
export class KeyCard {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  no: number;
  @Column()
  hotel_id: string;
}
