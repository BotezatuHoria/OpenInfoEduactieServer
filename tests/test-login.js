const axios = require('axios');

axios.post('http://localhost:6333/login', {
  email: 'mirel28',
  password: 'cefacecainele'
})
.then(response => {
  console.log(response.data);
});