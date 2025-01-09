import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IGetGuestsResponse } from '../model/Guest';
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
}
