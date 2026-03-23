const https = require('https');

https.get('https://www.youtube.com/watch?v=6BoN3vDkxk8', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const titleMatch = data.match(/<title>(.*?)<\/title>/);
    console.log(titleMatch ? titleMatch[1] : 'No title');
  });
});
