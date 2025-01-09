import { Component, inject } from '@angular/core';
import { GuestsService } from '../../services/guests.service';
import { IGetGuestsResponse, IGuest } from '../../model/Guest';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-guests',
  imports: [ReactiveFormsModule],
  templateUrl: './guests.component.html',
  styleUrl: './guests.component.css',
})
export class GuestsComponent {
  ngOnInit(): void {
    this.getGuestsList();
  }

  guestsService = inject(GuestsService);

  limit: number = 10;
  page: number = 1;

  guestsList: IGuest[] = [];

  getGuestsList() {
    this.guestsService
      .getGuests(this.limit, this.page)
      .subscribe((data: IGetGuestsResponse) => {
        if (data.message === 'findAll') {
          this.guestsList = data.data;
        } else {
          alert('Something went wrong');
        }
      });
  }
}
