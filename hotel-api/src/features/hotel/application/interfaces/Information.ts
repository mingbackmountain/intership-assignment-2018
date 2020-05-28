import { BookingHistory } from "../../domain/entities/BookingHistory";
import { CheckInHistory } from "../../domain/entities/CheckInHistory";

export interface confirmationInfo {
  bookingHistory: BookingHistory;
  checkInHistory: CheckInHistory;
}

export interface confirmationInfos {
  bookingHistories: BookingHistory[];
  checkInHistories: CheckInHistory[];
}
