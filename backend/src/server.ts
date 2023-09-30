import { config } from "dotenv";
config({ path: '../envs/backend.env' })
import Logger from './core/Logger';
import { port } from './config';
import app from './app';
import { connectMongo } from './mongoClient'
import { initCronJob } from './ashbyScheduler'

// connectMongo().catch(console.dir);
// initCronJob('*/10 * * * * *');

app
  .listen(port, () => {
    Logger.info(`server running on port : ${port}`);
  })
  .on('error', (e) => Logger.error(e));