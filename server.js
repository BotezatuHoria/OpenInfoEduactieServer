require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./utils/database');

const app = express();
app.use(cors());
app.use(express.json());

async function init() {
  try {
    // await db.init();

    app.listen(process.env.PORT | 6333, () => {
      console.log(`Running on port ${process.env.PORT | 6333}`);
    });
  } catch (e) {
    console.log(`Failed to initialise due to ${e.message}`);
  }
}

app.get('/', async (req, res) => {
  res.json({
    'status': 'success',
    'test': [
      'cainele',
      'cainele2',
      'cefacecainele'
    ]
  });
});

init();