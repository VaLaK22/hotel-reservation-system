export interface IGuest {
  id: number;
  name: string;
  email: string;
  phone_number: string;
}

export interface IGetGuestsResponse {
  data: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  }[];
  message: string;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ICreateGuestResponse {
  data: IGuest;
  message: string;
}

export interface IGuestById {
  findGuest: {
    id: number;
    name: string;
    phone_number: string;
    email: string;
  };
  upcomingReservations: {
    id: number;
    start_date: string;
    end_date: string;
    rooms: {
      room_id: number;
      room_number: number;
    }[];
  }[];
  pastReservationsCount: number;
}

export interface IGetGuestByIdResponse {
  data: IGuestById;
  message: string;
}

export interface IEditGuestResponse {
  data: IGuest;
  message: string;
}
