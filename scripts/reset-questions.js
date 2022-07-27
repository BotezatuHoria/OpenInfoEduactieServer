const db = require('../utils/database');

async function main() {
  await db.init();
  
  await db.resetQuestions();
}

main();