import { Component, inject, OnInit, signal } from '@angular/core';
import { ReservationsService } from '../../services/reservations.service';
import {
  IGetGuestsResponse,
  IGuest,
  IReservationInGetReservations,
  IRoom,
} from '../../model/Reservation';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-reservations',
  imports: [ReactiveFormsModule],
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.css',
})
export class ReservationsComponent implements OnInit {
  constructor(private readonly fb: NonNullableFormBuilder) {
    this.reservationForm = fb.group({
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      guest_id: [0, [Validators.required]],
      room_id: [[], [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getReservations();
    this.getGuestsList();
    this.getRoomList();
  }

  reservationsService = inject(ReservationsService);

  limit: number = 8;
  page: number = 1;
  totalPages: number = 1;
  totalPagesArr = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  addReservation = signal<boolean>(false);

  guestsList: IGuest[] = [];
  reservationList: IReservationInGetReservations[] = [];
  roomList: IRoom[] = [];

  reservationForm: FormGroup;

  setAddReservation() {
    this.addReservation.set(true);
  }

  resetAddReservation() {
    this.addReservation.set(false);
  }

  getGuestsList() {
    this.reservationsService
      .getGuests()
      .subscribe((data: IGetGuestsResponse) => {
        if (data.message === 'findAll') {
          this.guestsList = data.data;
        } else {
          alert('Something went wrong');
        }
      });
  }

  getRoomList() {
    return this.reservationsService.getRooms().subscribe((data) => {
      if (data.message === 'findAll') {
        this.roomList = data.data;
      } else {
        alert('Something went wrong');
      }
    });
  }

  getReservations() {
    this.reservationsService
      .getReservations(this.limit, this.page)
      .subscribe((data) => {
        if (data.message === 'findAll') {
          this.reservationList = data.data;
          this.totalPages = data.totalPages;
          this.page = data.page;
          this.limit = data.limit;
          this.totalPagesArr = Array.from(
            { length: this.totalPages },
            (_, i) => i + 1
          );
        } else {
          alert('Something went wrong');
        }
      });
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.getReservations();
    }
  }

  goNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getReservations();
    }
  }

  goPrevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getReservations();
    }
  }

  handleFormSubmit() {
    const formValue = this.reservationForm.value;
    formValue.guest_id = Number(formValue.guest_id);
    formValue.room_id = [Number(formValue.room_id)];
    this.reservationsService.createReservation(formValue).subscribe({
      next: (data) => {
        if (data.message === 'created') {
          this.getReservations();
          this.reservationForm.reset();
          this.resetAddReservation();
          alert('Reservation created successfully');
        } else {
          alert('Something went wrong');
        }
      },
      error: (err) => {
        alert(
          `Error:  ${
            err.error.message || 'Something went wrong. Please try again.'
          }`
        );
      },
    });
  }

  handleCancelReservation(id: number) {
    const result = confirm('Are you sure you want to cancel this reservation?');
    if (!result) {
      return;
    }

    this.reservationsService.cancelReservation(id).subscribe({
      next: (data) => {
        if (data.message === 'deleted') {
          this.getReservations();
          alert('Reservation cancelled successfully');
        } else {
          alert('Something went wrong');
        }
      },
      error: (err) => {
        alert(
          `Error:  ${
            err.error.message || 'Something went wrong. Please try again.'
          }`
        );
      },
    });
  }
}
