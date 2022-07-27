require('dotenv').config();
const axios = require('axios');

const db = require('../utils/database');

const { questions } = require('../dataset/default-questions.json');

async function main() {
  for (let i = 0; i < questions.length; ++i) {
    const response = await axios.post((process.env.ENV_TYPE === 'prod' ? 'https://api.open-infoed.cristimacovei.dev/' : 'http://localhost:6333/') + 'create-question/', {
      ...questions[i]
    });

    console.log(response);
  }
}

main();
