class Room {
  id: string;
  floorNumber: string;
  isAvailable: boolean;
  constructor(id: string, floorNumber: string) {
    this.id = id;
    this.floorNumber = floorNumber;
    this.isAvailable = true;
  }

  book(): void {
    this.isAvailable = false;
  }

  checkout(): void {
    this.isAvailable = true;
  }
}

export { Room };
