import { Component, inject, OnInit, signal } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { IGetGuestsResponse, IGuest, IGuestById } from '../../model/Guest';
import {
  ReactiveFormsModule,
  FormGroup,
  Validators,
  NonNullableFormBuilder,
} from '@angular/forms';

@Component({
  selector: 'app-guests',
  imports: [ReactiveFormsModule],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.css',
})
export class GuestsComponent implements OnInit {
  constructor(private readonly fb: NonNullableFormBuilder) {
    this.guestForm = fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone_number: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.getGuestsList();
  }

  guestsService = inject(GuestsService);

  limit: number = 8;
  page: number = 1;
  totalPages: number = 1;
  totalPagesArr = Array.from({ length: this.totalPages }, (_, i) => i + 1);

  addGuest = signal<boolean>(false);
  editGuest = signal<boolean>(false);
  viewGuest = signal<boolean>(false);

  guestForm: FormGroup;

  guestsList: IGuest[] = [];

  guest: IGuestById = {
    findGuest: {
      id: 0,
      name: '',
      phone_number: '',
      email: '',
    },
    upcomingReservations: [
      {
        id: 0,
        start_date: '',
        end_date: '',
        rooms: [
          {
            room_id: 0,
            room_number: 0,
          },
        ],
      },
    ],
    pastReservationsCount: 0,
  };

  setAddGuest() {
    this.addGuest.set(true);
  }

  resetAddGuest() {
    this.addGuest.set(false);
  }

  setEditGuest() {
    this.editGuest.set(true);
  }

  resetEditGuest() {
    this.editGuest.set(false);
    this.guestForm.reset();
  }

  setViewGuest() {
    this.viewGuest.set(true);
  }

  resetViewGuest() {
    this.viewGuest.set(false);
  }

  changePage(newPage: number): void {
    if (newPage >= 1 && newPage <= this.totalPages) {
      this.page = newPage;
      this.getGuestsList();
    }
  }

  goNextPage(): void {
    if (this.page < this.totalPages) {
      this.page++;
      this.getGuestsList();
    }
  }

  goPrevPage(): void {
    if (this.page > 1) {
      this.page--;
      this.getGuestsList();
    }
  }

  getGuestsList() {
    this.guestsService
      .getGuests(this.limit, this.page)
      .subscribe((data: IGetGuestsResponse) => {
        if (data.message === 'findAll') {
          this.guestsList = data.data;
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

  handleFormSubmit() {
    const formValue = this.guestForm.value;
    console.log(formValue);

    this.guestsService.createGuest(formValue).subscribe({
      next: (data) => {
        if (data.message === 'created') {
          this.getGuestsList();
          this.guestForm.reset();
          this.resetAddGuest();
          alert('Guest created successfully');
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

  getGuest(id: number, type: 'edit' | 'view') {
    this.guestsService.getGuestById(id).subscribe((data) => {
      if (data.message === 'findOne') {
        this.guestForm.patchValue(data.data.findGuest);
        this.guest = data.data;
        if (type === 'view') {
          this.viewGuest.set(true);
          return;
        }
        this.editGuest.set(true);
      } else {
        alert('Something went wrong');
      }
    });
  }

  handleEditFormSubmit() {
    const formValue = this.guestForm.value;
    const result = confirm('Are you sure you want to update this guest?');
    if (!result) {
      return;
    }

    this.guestsService.editGuest(this.guest.findGuest.id, formValue).subscribe({
      next: (data) => {
        if (data.message === 'updated') {
          this.getGuestsList();
          this.guestForm.reset();
          this.editGuest.set(false);
          alert('Guest updated successfully');
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
}
