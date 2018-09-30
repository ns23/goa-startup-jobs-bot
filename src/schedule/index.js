import schedule from 'node-schedule';
import fetchData from '../startupgoa/fetchdata';
import parseData from './htmlParser';
import addData from './updateDatabase';
import notify from './notify';
import log from '../logger';
// fetch data everyday at 1 AM
const rule = '0 1 * * *';

// fetch data every 5 minutes
// const rule = '*/5 * * * * ';

const j = schedule.scheduleJob(rule, () => {
  log.info('Scheduler started');
  fetchData.getData()
    .then((html) => {
      parseData(html)
        .then((josnData) => {
          addData(josnData)
            .then(() => notify())
            .catch(err => log.error(err.message));
        });
    })
    .catch(err => log.error(err.message));
});

export default j;
