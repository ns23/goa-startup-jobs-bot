import cheerio from 'cheerio';

function parseData(html) {
  return new Promise((resolve, reject) => {
    const $ = cheerio.load(html, {
      normalizeWhitespace: true,
    });
    const op = [];
    $('li[id^="job_listing"]').each(() => {
      op.push({
        job_id: $(this).attr('id').replace('job_listing-', ''),
        job_title: $(this).attr('data-title'),
        job_type: $(this).find('ul.meta>li.job-type').text().trim(),
        job_link: $(this).attr('data-href'),
        posted_date: $(this).find('ul.meta>li.date')
          .text()
          .replace(/Posted|ago/gi, '')
          .trim(),
      });
    });
    resolve(op);
  });
}

export default parseData;
