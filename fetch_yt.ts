async function fetchYT() {
  const res = await fetch('https://www.youtube.com/@SintagmaMidia');
  const text = await res.text();
  const match = text.match(/"externalId":"([^"]+)"/);
  console.log(match ? match[1] : 'not found');
}
fetchYT();
