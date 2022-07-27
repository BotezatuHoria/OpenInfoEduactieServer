require('dotenv').config();
const express = require('express');
const cors = require('cors');

const db = require('./utils/database');
const checks = require('./utils/checks');
const { hash } = require('./utils/hash');

const app = express();
app.use(cors());
app.use(express.json());

async function init() {
  try {
    await db.init();

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

app.post('/login', async (req, res) => {
  console.log('Received request on /login', req.body);

  const email = req.body.email;
  const password = req.body.password;

  const emailNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(email);
  const passwordNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(password);

  if (!emailNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `Email invalid due to: ${emailNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  if (!passwordNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `Password invalid due to: ${passwordNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  const usersResult = await db.findUsersByEmail(email);
  
  if (typeof usersResult.error !== 'undefined') {
    res.json({
      'status': 'error',
      error: {
        message: `Error when looking up email in the database: ${usersResult.error.message}`
      }
    });

    return;
  }

  const { users } = usersResult;
  if (users.length === 0) {
    res.json({
      status: 'error',
      error: {
        message: `No users found by email ${email}`
      }
    });

    return;
  }

  const hashResult = hash(password);

  if (hashResult.status === 'error') {
    res.json({
      status: 'error',
      error: {
        message: `Error when hashing password: ${hashResult.error?.message}`
      }
    });

    return;
  }

  const hashedPassword = hashResult.hashedPassword;

  const hashedPasswordNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(hashedPassword);
  if (!hashedPasswordNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `Hashed password invalid due to: ${hashedPasswordNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  const userResult = await db.findUserByEmailAndHashedPassword(email, hashedPassword);

  if (typeof userResult.error !== 'undefined') {
    res.json({
      status: 'error',
      error: {
        message: `Error when looking up user: ${userResult.error.message}`
      }  
    });

    return;
  }

  const { user } = userResult;
  if (user === null) {
    res.json({
      status: 'error',
      error: {
        message: `No user found by email ${email} and password ${password}`
      }
    });

    return;
  }

  res.json({
    status: 'success',
    data: user
  });
});

app.post('/signup', async (req, res) => {
  console.log('Received request on /signup', req.body);

  const email = req.body.email;
  const password = req.body.password;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;

  const emailNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(email);
  const passwordNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(password);
  const firstNameNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(firstName);
  const lastNameNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(lastName);

  if (!emailNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `Email invalid due to: ${emailNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  if (!passwordNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `Password invalid due to: ${passwordNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  if (!firstNameNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `first name invalid due to: ${firstNameNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  if (!lastNameNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `last name invalid due to: ${lastNameNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  const hashResult = hash(password);
  if (hashResult.status === 'error') {
    res.json({
      status: 'error',
      error: {
        message: `Error when hashing password: ${hashResult.error?.message}`
      }
    });

    return;
  }

  const hashedPassword = hashResult.hashedPassword;

  const hashedPasswordNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(hashedPassword);
  if (!hashedPasswordNotNullOrEmptyStringCheck.valid) {
    res.json({
      status: 'error',
      error: {
        message: `Hashed password invalid due to: ${hashedPasswordNotNullOrEmptyStringCheck.reason}`
      }
    });

    return;
  }

  const userResult = await db.findUserByEmailAndHashedPassword(email, hashedPassword);

  if (typeof userResult.error !== 'undefined') {
    res.json({
      status: 'error',
      error: {
        message: `Error when looking up user: ${userResult.error.message}`
      }  
    });

    return;
  }

  const { user } = userResult;
  if (user !== null) {
    res.json({
      status: 'error',
      error: {
        message: `user already exists`
      }
    });

    return;
  }

  const newUserResult = await db.createUser(email, hashedPassword, firstName, lastName);

  if (typeof newUserResult.error !== 'undefined') {
    res.json({
      status: 'error',
      error: {
        message: `error when creating user: ${newUserResult.error.message}`
      }
    });

    return;
  }

  const { user: newUser } = newUserResult;
  res.json({
    status: 'success',
    data: newUser
  });  
});

init();