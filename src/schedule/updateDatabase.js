import moment from 'moment';
import JobList from '../models/Job';


function addData(data) {
  return new Promise((resolve, reject) => {
    let temp;
    const insertData = data.map((elem) => {
      temp = elem.posted_date.split(' ');
      elem.posted_date = moment().subtract(parseInt(temp[0], 10), temp[1]).toDate();
      elem.is_notified = false;
      return elem;
    });

    JobList
      .find({})
      .select('job_id')
      .exec((err, data) => {
        if (err) {
          reject(err);
        }
        const jobIds = data.map(a => a.job_id);
        const filteredInsertData = insertData.filter(job => !jobIds.includes(parseInt(job.job_id)));
        if (filteredInsertData.length > 0) {
          JobList.insertMany(filteredInsertData).then((err, docs) => {
            if (err) {
              console.log(err);
            }
            resolve(docs);
          });
        } else {
          resolve('Nothing to update');
        }
      });
  });
}

export default addData;
