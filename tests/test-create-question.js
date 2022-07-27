require('dotenv').config();
const axios = require('axios');

for (let i = 0; i < 4; ++i) {
  axios.post((process.env.ENV_TYPE === 'prod' ? 'https://api.open-infoed.cristimacovei.dev/' : 'http://localhost:6333/') + 'create-question/', {
    prompt: `Test question ${2 + i}`,
    answers: [
      {
        prompt: 'Answer #1',
        isCorrect: false
      },
      {
        prompt: 'Answer #2',
        isCorrect: true
      },
      {
        prompt: 'Answer #3',
        isCorrect: true
      },
      {
        prompt: 'Answer #4',
        isCorrect: false
      },
      {
        prompt: 'Answer #5',
        isCorrect: false
      }
    ]
  })
  .then(res => console.log(res.data))
}
