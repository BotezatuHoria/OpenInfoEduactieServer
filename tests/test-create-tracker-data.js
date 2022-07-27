require('dotenv').config();
const axios = require('axios');

for (let i = 0; i < 5; ++i) {
  axios.post((process.env.ENV_TYPE === 'prod' ? 'https://api.open-infoed.cristimacovei.dev/' : 'http://localhost:6333/') + 'add-tracker-data', {
    userId: 1,
    day: i + 2,
    data: {
      sleep: Math.floor(Math.random() * 300 + 100),
      entertainment: Math.floor(Math.random() * 300 + 100),
      work: Math.floor(Math.random() * 300 + 100),
      outside: Math.floor(Math.random() * 300 + 100)
    }
  })
  .then(res => console.log(res.data));
}
