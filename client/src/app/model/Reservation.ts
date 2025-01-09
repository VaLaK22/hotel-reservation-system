export interface IReservation {
  start_date: string | undefined;
  end_date: string | undefined;
  guest_id: number | undefined;
  room_id: number[] | undefined;
}

export interface IGuest {
  id: number;
  name: string;
  email: string;
  phone_number: string;
}

export interface IRoom {
  id: number;
  room_name: string;
  room_number: number;
}

export interface IGetGuestsResponse {
  data: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  }[];
  message: string;
}

export interface IGetRoomsResponse {
  data: {
    id: number;
    room_name: string;
    room_number: number;
  }[];
  message: string;
}

export interface IReservationInGetReservations {
  id: number;
  start_date: string;
  end_date: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  rooms: {
    room_id: number;
    room_number: number;
  }[];
}

export interface IGetRservationResponse {
  data: IReservationInGetReservations[];
  message: string;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateReservationResponse {
  data: {
    id: number;
  };
  message: string;
}

export interface ICancelReservationResponse {
  message: string;
}
