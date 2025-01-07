import { App } from '@/app';
import { GuestRoute } from '@routes/guests.route';
import { ValidateEnv } from '@utils/validateEnv';

ValidateEnv();

const app = new App([new GuestRoute()]);

app.listen();
