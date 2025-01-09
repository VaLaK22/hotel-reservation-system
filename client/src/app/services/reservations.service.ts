import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ICreateReservationResponse,
  ICancelReservationResponse,
  IGetGuestsResponse,
  IGetRoomsResponse,
  IGetRservationResponse,
  IReservation,
} from '../model/Reservation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReservationsService {
  constructor(private http: HttpClient) {}

  getGuests(): Observable<IGetGuestsResponse> {
    return this.http.get<IGetGuestsResponse>(`http://localhost:3000/guests`);
  }

  getRooms(): Observable<IGetRoomsResponse> {
    return this.http.get<IGetRoomsResponse>('http://localhost:3000/rooms');
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
}
