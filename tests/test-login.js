require('dotenv').config();
const axios = require('axios');

axios.post((process.env.ENV_TYPE === 'prod' ? 'https://api.open-infoed.cristimacovei.dev/' : 'http://localhost:6333/') + 'login', {
  email: 'mirel28',
  password: 'cefacecainele'
})
.then(response => {
  console.log(response.data);
});