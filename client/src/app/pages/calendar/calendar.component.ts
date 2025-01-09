import { Component, inject, OnInit } from '@angular/core';
import { ReservationsService } from '../../services/reservations.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent implements OnInit {
  ngOnInit(): void {
    this.generateCalendar();
    this.loadReservations();
  }

  reservationService = inject(ReservationsService);

  currentDate: Date = new Date();
  daysInMonth: Date[] = [];
  reservationCounts: { [date: string]: number } = {};

  generateCalendar() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    this.daysInMonth = [];

    for (let i = firstDay.getDay(); i > 0; i--) {
      this.daysInMonth.unshift(new Date(year, month, -i + 1));
    }

    for (let day = 1; day <= lastDay.getDate(); day++) {
      this.daysInMonth.push(new Date(year, month, day));
    }

    for (let i = 1; this.daysInMonth.length % 7 !== 0; i++) {
      this.daysInMonth.push(new Date(year, month + 1, i));
    }
  }

  loadReservations() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth() + 1;

    this.reservationService
      .getMonthlyReservations(year, month)
      .subscribe((data) => {
        this.reservationCounts = {};

        data.data.days.forEach((day: any) => {
          this.reservationCounts[day.date] = day.reservationCount;
        });
      });
  }

  getReservationCount(date: Date): number {
    const formattedDate = date.toISOString().split('T')[0];
    return this.reservationCounts[formattedDate] || 0;
  }
}
