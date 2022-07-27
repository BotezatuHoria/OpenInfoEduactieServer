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

  return {
    status: 'success',
    hashedPassword: password //todo hash with sha 
  }; 
}

module.exports = {
  hash
};