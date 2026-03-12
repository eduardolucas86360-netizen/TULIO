async function fetchRss() {
  const res = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UCubalZ-AjWT_MaTpvE1DS5A');
  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}
fetchRss();
