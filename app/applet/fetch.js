const https = require('https');

https.get('https://www.youtube.com/playlist?list=PLViy6sxGKxPY43unlZ9z58ZhKKD6r0hRc', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/var ytInitialData = (\{.*?\});/);
    if (match) {
      const json = JSON.parse(match[1]);
      try {
        const items = json.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
        const videos = items.map(item => {
          if (item.playlistVideoRenderer) {
            return {
              id: item.playlistVideoRenderer.videoId,
              title: item.playlistVideoRenderer.title.runs[0].text,
              thumbnail: item.playlistVideoRenderer.thumbnail.thumbnails[0].url.split('?')[0]
            };
          }
        }).filter(Boolean);
        console.log(JSON.stringify(videos, null, 2));
      } catch (e) {
        console.log("Error parsing items", e);
      }
    } else {
      console.log('No match');
    }
  });
});
