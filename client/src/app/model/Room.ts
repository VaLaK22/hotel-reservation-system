export interface IRoom {
  id: number;
  room_number: number;
  room_name: string;
  total_reservations: number;
}

export interface IGetRoomsResponse {
  data: IRoom[];
  message: string;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateRoomResponse {
  data: {
    id: number;
    room_number: number;
    room_name: string;
  };
  message: string;
}

export interface IRoomById {
  id: number;
  room_number: number;
  room_name: string;
  currentReservation: {
    id: number;
    start_date: string;
    end_date: string;
    guest_name: string;
  };
  upcomingReservations?: {
    id: number;
    start_date: string;
    end_date: string;
    guest_name: string;
  }[];
}

export interface IGetRoomByIdResponse {
  data: IRoomById;
  message: string;
}

export interface IEditRoomResponse {
  data: {
    id: number;
    room_number: number;
    room_name: string;
  };
  message: string;
}
