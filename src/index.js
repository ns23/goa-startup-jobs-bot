import mongoose from 'mongoose';
import bot from './router/bot';
import scheduleTask from './schedule/index';
import log from './logger';

require('dotenv').config();

const dbUrl = process.env.DB_HOST;
mongoose.connect(dbUrl, { useNewUrlParser: true })
  .then(() => {
    log.info('Connected to database!!');
    scheduleTask.invoke();
  })
  .catch(err => log.error(err.message));


bot.start(process.env.PORT || 3000);
