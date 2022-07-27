const axios = require('axios');

axios.post('http://localhost:6333/signup', {
  email: 'mirel28',
  firstName: 'Mirel',
  lastName: 'Prastie',
  password: 'cefacecainele'
})
.then(response => {
  console.log(response.data);
});