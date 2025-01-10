import { Component, inject, OnInit, signal } from '@angular/core';
import { RoomsService } from '../../services/rooms.service';
import { IRoom, IRoomById } from '../../model/Room';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';
@Component({
  selector: 'app-rooms',
  imports: [ReactiveFormsModule],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.css',
})
export class RoomsComponent implements OnInit {
  constructor(private readonly fb: NonNullableFormBuilder) {
    this.roomForm = fb.group({
      room_number: [0, [Validators.required]],
      room_name: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getRoomsList();
  }

  roomsService = inject(RoomsService);

  limit: number = 8;
  page: number = 1;
  totalPages: number = 1;
  totalPagesArr = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  sort: string = 'room_number';

  addRoom = signal<boolean>(false);
  editRoom = signal<boolean>(false);

  roomForm: FormGroup;

  roomsList: IRoom[] = [];

  room: IRoomById = {
    id: 0,
    room_number: 0,
    room_name: '',
    currentReservation: {
      id: 0,
      start_date: '',
      end_date: '',
      guest_name: '',
    },
    upcomingReservations: [],
  };

  setAddRoom() {
    this.addRoom.set(true);
  }

  resetAddRoom() {
    this.addRoom.set(false);
  }

  setEditRoom() {
    this.editRoom.set(true);
  }

  resetEditRoom() {
    this.editRoom.set(false);
  }

  getRoomsList() {
    this.roomsService
      .getRooms(this.limit, this.page, this.sort)
      .subscribe((data) => {
        this.roomsList = data.data;
        this.totalPages = data.totalPages;
        this.page = data.page;
        this.limit = data.limit;
        this.totalPagesArr = Array.from(
          { length: this.totalPages },
          (_, i) => i + 1
        );
      });
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.getRoomsList();
    }
  }

  goNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getRoomsList();
    }
  }

  goPrevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getRoomsList();
    }
  }

  handleFormSubmit() {
    const formValue = this.roomForm.value;
    formValue.room_number = parseInt(formValue.room_number, 10);

    this.roomsService.createRoom(formValue).subscribe({
      next: (data) => {
        if (data.message === 'created') {
          this.getRoomsList();
          this.roomForm.reset();
          this.resetAddRoom();
          alert('Room created successfully');
        } else {
          alert('Something went wrong');
        }
      },
      error: (err) => {
        alert(
          `Error: ${
            err.error.message || 'Something went wrong. Please try again.'
          }`
        );
      },
    });
  }

  getRoom = (id: number) => {
    this.roomsService.getRoomById(id).subscribe((data) => {
      if (data.message === 'findOne') {
        this.roomForm.patchValue({
          room_number: data.data.room_number,
          room_name: data.data.room_name,
        });
        this.room = data.data;
        this.setEditRoom();
      } else {
        alert('Something went wrong');
      }
    });
  };

  handleEditRoom = () => {
    const formValue = this.roomForm.value;
    formValue.room_number = parseInt(formValue.room_number, 10);
    const result = confirm('Are you sure you want to update this room?');
    if (!result) {
      return;
    }

    this.roomsService.editRoom(this.room.id, formValue).subscribe({
      next: (data) => {
        if (data.message === 'updated') {
          this.getRoomsList();
          this.roomForm.reset();
          this.resetEditRoom();
          alert('Room updated successfully');
        } else {
          alert('Something went wrong');
        }
      },
      error: (err) => {
        alert(
          `Error: ${
            err.error.message || 'Something went wrong. Please try again.'
          }`
        );
      },
    });
  };
}
