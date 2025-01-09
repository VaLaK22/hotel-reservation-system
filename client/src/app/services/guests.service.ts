import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  IGuest,
  ICreateGuestResponse,
  IEditGuestResponse,
  IGetGuestByIdResponse,
  IGetGuestsResponse,
} from '../model/Guest';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GuestsService {
  constructor(private http: HttpClient) {}

  getGuests(Limit: number, Page: number): Observable<IGetGuestsResponse> {
    return this.http.get<IGetGuestsResponse>(
      `http://localhost:3000/guests?limit=${Limit}&page=${Page}`
    );
  }

  createGuest(data: IGuest): Observable<ICreateGuestResponse> {
    return this.http.post<ICreateGuestResponse>(
      'http://localhost:3000/guests',
      data
    );
  }

  getGuestById(id: number): Observable<IGetGuestByIdResponse> {
    return this.http.get<IGetGuestByIdResponse>(
      `http://localhost:3000/guests/${id}`
    );
  }

  editGuest(id: number, data: IGuest): Observable<IEditGuestResponse> {
    return this.http.put<IEditGuestResponse>(
      `http://localhost:3000/guests/${id}`,
      data
    );
  }
}
