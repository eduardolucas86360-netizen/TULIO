const https = require('https');

https.get('https://www.youtube.com/@SintagmaMidia/videos', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/var ytInitialData = (\{.*?\});/);
    if (match) {
      const json = JSON.parse(match[1]);
      try {
        const items = json.contents.twoColumnBrowseResultsRenderer.tabs[1].tabRenderer.content.richGridRenderer.contents;
        const videos = items.map(item => {
          if (item.richItemRenderer && item.richItemRenderer.content.videoRenderer) {
            const video = item.richItemRenderer.content.videoRenderer;
            return {
              id: video.videoId,
              title: video.title.runs[0].text,
              thumbnail: video.thumbnail.thumbnails[0].url.split('?')[0]
            };
          }
        }).filter(Boolean);
        console.log(JSON.stringify(videos.slice(0, 10), null, 2));
      } catch (e) {
        console.log("Error parsing items", e);
      }
    } else {
      console.log('No match');
    }
  });
});
