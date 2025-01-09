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
  limit: number = 10;
  page: number = 1;

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
        } else {
          alert('Something went wrong');
        }
      });
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
