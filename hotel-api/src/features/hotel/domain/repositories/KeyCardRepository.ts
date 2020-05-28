import { KeyCard } from "../entities/KeyCard";
import { EntityRepository, Repository } from "typeorm";

@EntityRepository(KeyCard)
export class KeyCardRepository extends Repository<KeyCard> {
  public async getKeycard(hotelId: string, keyCardNo: number) {
    try {
      const keycard = await this.findOneOrFail({
        no: keyCardNo,
        hotel_id: hotelId
      });

      return keycard;
    } catch (err) {
      console.log("keycard not find");
    }
  }

  public async createKeyCards(
    hotelId: string,
    keycardCount: number
  ): Promise<KeyCard[]> {
    const keycards = Array.from({ length: keycardCount }, (_, KeyCardindex) => {
      const KeyCardNo = KeyCardindex + 1;
      return this.create({
        no: KeyCardNo,
        hotel_id: hotelId
      });
    }).reverse();

    this.save(keycards);

    return keycards;
  }
  public async borrowKeyCard(hotelId: string): Promise<KeyCard> {
    const keycard = await this.findOneOrFail({
      where: {
        hotel_id: hotelId
      },
      order: {
        no: "ASC"
      }
    });

    await this.remove(keycard);

    return keycard;
  }
  public async borrowKeyCards(
    hotelId: string,
    roomCount: number
  ): Promise<KeyCard[]> {
    const keycards = await this.find({
      where: {
        hotel_id: hotelId
      },
      order: {
        no: "ASC"
      },
      take: roomCount
    });

    await this.remove(keycards);

    return keycards;
  }

  public async returnKeyCard(
    hotelId: string,
    keyCardNo: number
  ): Promise<void> {
    const keycard = await this.create({
      no: keyCardNo,
      hotel_id: hotelId
    });

    this.save(keycard);
  }
}
