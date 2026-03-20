const axios = require('axios');

async function testDevTo() {
  try {
    const res = await axios.get('https://dev.to/api/articles?tag=webdev&per_page=1');
    console.log(JSON.stringify(res.data[0], null, 2));
  } catch (e) {
    console.error(e);
  }
}

testDevTo();
