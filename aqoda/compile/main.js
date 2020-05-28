"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const Command_1 = require("./models/Command");
const CustomerInfo_1 = require("./models/CustomerInfo");
const HotelApplication_1 = require("./HotelApplication");
function main() {
    const inputFile = "input.txt";
    const commands = getCommandFromInputFile(inputFile);
    const hotelApplication = new HotelApplication_1.HotelApplication();
    commands.forEach(command => {
        switch (command.name) {
            case "create_hotel": {
                const [floorCount, roomCount] = command.params;
                hotelApplication.createHotel(floorCount, roomCount);
                console.log(`Hotel created with ${floorCount} floor(s), ${roomCount} room(s) per floor.`);
                break;
            }
            case "book": {
                const [roomId, name, age] = command.params;
                const customerInfo = new CustomerInfo_1.CustomerInfo(name, age);
                try {
                    const bookingInfo = hotelApplication.book(roomId, customerInfo);
                    console.log(`Room ${bookingInfo.room.id} is booked by ${bookingInfo.customerInfo.name} with keycard number ${bookingInfo.keycardId}.`);
                }
                catch (err) {
                    console.log(err.message);
                }
                break;
            }
            case "checkout": {
                const [keycardId, name] = command.params;
                try {
                    const checkoutBookingInfo = hotelApplication.checkout(keycardId, name);
                    console.log(`Room ${checkoutBookingInfo.room.id} is checkout.`);
                }
                catch (err) {
                    console.log(err.message);
                }
                break;
            }
            case "list_available_rooms": {
                const availableRooms = hotelApplication.getAvailableRooms();
                const roomIds = availableRooms.map(availableRoom => availableRoom.id);
                console.log(roomIds.join());
                break;
            }
            case "list_guest": {
                const guestNames = hotelApplication.getAllGuestNames();
                console.log(guestNames.join());
                break;
            }
            case "get_guest_in_room": {
                const [roomId] = command.params;
                const guest = hotelApplication.getGuestNameByRoomId(roomId);
                console.log(guest);
                break;
            }
            case "list_guest_by_age": {
                const [sign, age] = command.params;
                const guestNames = hotelApplication.getGuestNamesByAge(sign, parseInt(age));
                console.log(guestNames.join());
                break;
            }
            case "list_guest_by_floor": {
                const [floorNumber] = command.params;
                const guests = hotelApplication.getGuestsByFloorNumber(floorNumber);
                const guestNames = guests.map(guest => guest.name);
                console.log(guestNames.join());
                break;
            }
            case "checkout_guest_by_floor": {
                const [floorNumber] = command.params;
                const roomIds = hotelApplication.checkoutByFloorNumber(floorNumber);
                console.log(`Room ${roomIds} are checkout.`);
                break;
            }
            case "book_by_floor": {
                const [floorNumber, name, age] = command.params;
                try {
                    const customerInfo = new CustomerInfo_1.CustomerInfo(name, age);
                    const roomsAndKeycards = hotelApplication.bookByFloorNumber(floorNumber, customerInfo);
                    const bookedRoomIds = roomsAndKeycards.map(roomAndKeycard => roomAndKeycard.bookedRoomIds);
                    const keycardIds = roomsAndKeycards.map(roomAndKeycard => roomAndKeycard.keycardIds);
                    console.log(`Room ${bookedRoomIds.join()} are booked with keycard number${keycardIds.join()}`);
                }
                catch (err) {
                    console.log(err.message);
                }
                break;
            }
            default:
                return;
        }
    });
}
function getCommandFromInputFile(inputFile) {
    return fs_1.readFileSync(inputFile, "utf-8")
        .split("\n")
        .map(line => line.split(" "))
        .map(([name, ...params]) => new Command_1.Command(name, params));
}
main();
