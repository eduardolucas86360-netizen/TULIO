const https = require('https');

https.get('https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fwww.youtube.com%2Ffeeds%2Fvideos.xml%3Fplaylist_id%3DPLViy6sxGKxPanZxNSiB2vliqfypJCIVqA', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const json = JSON.parse(data);
    if (json.status === 'ok' && json.items) {
      const videos = json.items.map(item => {
        const videoId = item.guid.replace('yt:video:', '');
        return {
          id: videoId,
          title: item.title,
          thumbnail: item.thumbnail,
          videoId: videoId
        };
      });
      console.log(JSON.stringify(videos, null, 2));
    } else {
      console.log('Error or empty', json);
    }
  });
});
