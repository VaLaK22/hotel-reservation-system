export interface Reservations {
  id: number;
  guest_id: number;
  room_id: number[];
  start_date: string;
  end_date: string;
}
