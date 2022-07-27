require('dotenv').config();
const axios = require('axios');

axios.get((process.env.ENV_TYPE === 'prod' ? 'https://api.open-infoed.cristimacovei.dev/' : 'http://localhost:6333/') + 'questions')
.then(res => console.log(res.data));