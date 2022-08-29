import express from 'express';
import dotenv from 'dotenv';

import { connectToDatabase } from './databaseConnection';
import { farmsRoute } from './routes/farms.route';
import { turbinesRoute } from './routes/turbines.route';
import { maintenanceRoute } from './routes/maintenance.route';

dotenv.config();

const PORT = parseInt(process.env.PORT || '4500');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use('/', farmsRoute());
app.use('/', turbinesRoute());
app.use('/', maintenanceRoute());

app.listen(PORT, async () => {
  await connectToDatabase();

  console.log(`Application started on URL http://localhost:${PORT} 🎉`);
});
