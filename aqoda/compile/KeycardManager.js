"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Keycard_1 = require("./models/Keycard");
const db_1 = require("./db");
class KeycardManager {
    constructor(totalNumberOfRoom) {
        db_1.setKeycards(this.createKeycardList(totalNumberOfRoom));
    }
    get keycardList() {
        return db_1.getKeycards();
    }
    createKeycardList(totalNumberOfRoom) {
        return Array.from(new Array(totalNumberOfRoom)).map((_, index) => {
            const keycardId = (index + 1).toString();
            return new Keycard_1.Keycard(keycardId);
        });
    }
    assignKeycard(keycard, roomId) {
        keycard.roomId = roomId;
        return keycard.id;
    }
    dischargeKeycard(keycard) {
        keycard.roomId = undefined;
        return keycard;
    }
    getAvailableKeycard() {
        return this.keycardList.find(keycard => keycard.roomId === undefined);
    }
    getAllAvailableKeycard() {
        return this.keycardList.filter(keycard => keycard.roomId === undefined);
    }
    getKeycardById(keycardId) {
        return this.keycardList.find(keycard => keycard.id === keycardId);
    }
    getKeycardByRoomId(roomId) {
        return this.keycardList.find(keycard => keycard.roomId === roomId);
    }
}
exports.KeycardManager = KeycardManager;
