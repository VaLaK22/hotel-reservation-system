import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ICreateReservationResponse,
  ICancelReservationResponse,
  IGetGuestsResponse,
  IGetRoomsResponse,
  IGetRservationResponse,
  IReservation,
  IMonthlyReservationsResponse,
} from '../model/Reservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  getGuests(): Observable<IGetGuestsResponse> {
    return this.http.get<IGetGuestsResponse>(
      `http://localhost:3000/guests/dropdown`
    );
  }

  getRooms(): Observable<IGetRoomsResponse> {
    return this.http.get<IGetRoomsResponse>(
      'http://localhost:3000/rooms/dropdown'
    );
  }

  getReservations(
    Limit: number,
    Page: number
  ): Observable<IGetRservationResponse> {
    return this.http.get<IGetRservationResponse>(
      `http://localhost:3000/reservations?limit=${Limit}&page=${Page}`
    );
  }

  createReservation(
    data: IReservation
  ): Observable<ICreateReservationResponse> {
    return this.http.post<ICreateReservationResponse>(
      'http://localhost:3000/reservations',
      data
    );
  }

  cancelReservation(id: number): Observable<ICancelReservationResponse> {
    return this.http.delete<ICancelReservationResponse>(
      `http://localhost:3000/reservations/${id}`
    );
  }

  getMonthlyReservations(
    year: number,
    month: number
  ): Observable<IMonthlyReservationsResponse> {
    return this.http.get<IMonthlyReservationsResponse>(
      `http://localhost:3000/reservations/calendar/${month}/${year}`
    );
  }
}
