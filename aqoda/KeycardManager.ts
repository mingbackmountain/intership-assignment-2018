import { Keycard } from "./models/Keycard";
import { setKeycards, getKeycards } from "./db";

class KeycardManager {
  constructor(totalNumberOfRoom: number) {
    setKeycards(this.createKeycardList(totalNumberOfRoom));
  }

  get keycardList() {
    return getKeycards();
  }

  createKeycardList(totalNumberOfRoom: number) {
    return Array.from(new Array(totalNumberOfRoom)).map((_, index) => {
      const keycardId: string = (index + 1).toString();
      return new Keycard(keycardId);
    });
  }

  assignKeycard(keycard: Keycard, roomId: string) {
    keycard.roomId = roomId;

    return keycard.id;
  }

  dischargeKeycard(keycard: Keycard) {
    keycard.roomId = undefined;

    return keycard;
  }

  getAvailableKeycard() {
    return this.keycardList.find(keycard => keycard.roomId === undefined);
  }

  getAllAvailableKeycard() {
    return this.keycardList.filter(keycard => keycard.roomId === undefined);
  }

  getKeycardById(keycardId: string) {
    return this.keycardList.find(keycard => keycard.id === keycardId);
  }

  getKeycardByRoomId(roomId: string) {
    return this.keycardList.find(keycard => keycard.roomId === roomId);
  }
}

export { KeycardManager };
