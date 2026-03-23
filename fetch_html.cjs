const https = require('https');

https.get('https://www.youtube.com/playlist?list=PLViy6sxGKxPbBrnTBae-GDIsh_IYtdR5F', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/"videoId":"([^"]+)"/g);
    if (matches) {
      const uniqueIds = [...new Set(matches.map(m => m.split('"')[3]))];
      console.log(uniqueIds.slice(0, 10));
    } else {
      console.log('No matches');
    }
  });
});
