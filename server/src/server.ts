import { App } from '@/app';
import { GuestRoute } from '@routes/guests.route';
import { RoomRoute } from '@routes/rooms.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new GuestRoute(), new RoomRoute()]);

app.listen();
