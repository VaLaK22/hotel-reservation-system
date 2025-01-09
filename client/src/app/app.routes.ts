import { Routes } from '@angular/router';
import { LayoutComponent } from './pages/layout/layout.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { GuestsComponent } from './pages/guests/guests.component';
import { ReservationsComponent } from './pages/reservations/reservations.component';
import { RoomsComponent } from './pages/rooms/rooms.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full',
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'calendar',
        component: CalendarComponent,
      },
      {
        path: 'rooms',
        component: RoomsComponent,
      },
      {
        path: 'reservations',
        component: ReservationsComponent,
      },
      {
        path: 'guests',
        component: GuestsComponent,
      },
    ],
  },
];
