require('dotenv').config();
const { sha256 } = require('js-sha256');

const checks = require('./checks.js');

function hash(password) {
  const notNullOrEmptyStringCheck = checks.notNullOrEmptyString(password);

  if (!notNullOrEmptyStringCheck.valid) {
    return {
      status: 'error',
      error: {
        message: `Password invalid due to ${notNullOrEmptyStringCheck.reason}`
      }
    };
  }

  const hashedPassword = sha256(process.env.PASSWORD_HASH_ADDON + password);

  return {
    status: 'success',
    hashedPassword: hashedPassword //todo hash with sha 
  }; 
}

module.exports = {
  hash
};