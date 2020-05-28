class Keycard {
  id: string;
  roomId?: string;
  constructor(keycardId: string) {
    this.id = keycardId;
    this.roomId = undefined;
  }
}

export { Keycard };
