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
}
