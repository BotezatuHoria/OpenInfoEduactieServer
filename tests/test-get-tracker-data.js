require('dotenv').config();
const axios = require('axios');

axios.get((process.env.ENV_TYPE === 'prod' ? 'https://api.open-infoed.cristimacovei.dev/' : 'http://localhost:6333/') + 'tracker-data', {
  params: {
    id: 1
  }
})
.then(res => console.log(res.data));