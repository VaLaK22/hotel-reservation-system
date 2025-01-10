import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  IRoom,
  ICreateRoomResponse,
  IEditRoomResponse,
  IGetRoomByIdResponse,
  IGetRoomsResponse,
} from '../model/Room';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class RoomsService {
  constructor(private http: HttpClient) {}

  getRooms(
    limit: number,
    page: number,
    sort: string
  ): Observable<IGetRoomsResponse> {
    return this.http.get<IGetRoomsResponse>(
      `http://localhost:3000/rooms?limit=${limit}&page=${page}&sort=${sort}`
    );
  }

  createRoom(data: IRoom): Observable<ICreateRoomResponse> {
    return this.http.post<ICreateRoomResponse>(
      'http://localhost:3000/rooms',
      data
    );
  }

  getRoomById(id: number): Observable<IGetRoomByIdResponse> {
    return this.http.get<IGetRoomByIdResponse>(
      `http://localhost:3000/rooms/${id}`
    );
  }

  editRoom(id: number, data: IRoom): Observable<IEditRoomResponse> {
    return this.http.put<IEditRoomResponse>(
      `http://localhost:3000/rooms/${id}`,
      data
    );
  }
}
