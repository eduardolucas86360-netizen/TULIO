const https = require('https');

const videoIds = ['foSgpqZjFrI', 'Syq3pa9ix8g', 'PS3VGSZb_9E', '0v6ys4xxdYY', 'PcVzKS69m18'];

function fetchTitle(id) {
  return new Promise((resolve) => {
    https.get(`https://www.youtube.com/watch?v=${id}`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<title>(.*?)<\/title>/);
        resolve({ id, title: match ? match[1].replace(' - YouTube', '') : 'Institucional' });
      });
    });
  });
}

Promise.all(videoIds.map(fetchTitle)).then(results => console.log(JSON.stringify(results, null, 2)));
