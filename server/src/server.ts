import { App } from '@/app';
import { GuestRoute } from '@routes/guests.route';
import { RoomRoute } from '@routes/rooms.route';
import { ReservationIRoute } from '@routes/reservations.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new GuestRoute(), new RoomRoute(), new ReservationIRoute()]);

app.listen();
