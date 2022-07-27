const { Sequelize, DataTypes } = require('sequelize');

const checks = require('./checks');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './db/users.sqlite3'
});

async function defineModels() {
  sequelize.define('User', {
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    hashedPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
    // todo add the other info here
  }, {
    tableName: 'users'
  })
}

async function init() {
  await defineModels();

  await sequelize.sync({ force: false }); // todo remove force once table structure is well established
}

async function findUsersByEmail(email) {
  const notNullOrEmptyStringCheck = checks.notNullOrEmptyString(email);

  if (!notNullOrEmptyStringCheck.valid) {
    return {
      users: [],
      error: {
        message: `email invalid due to: ${notNullOrEmptyStringCheck.reason}`
      }
    };
  }

  const users = await sequelize.models.User.findAll({
    where: {
      email
    }
  });

  return {
    users
  };
}

async function findUserByEmailAndHashedPassword(email, hashedPassword) {
  const emailNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(email);
  if (!emailNotNullOrEmptyStringCheck.valid) {
    return {
      user: null,
      error: {
        message: `email invalid due to: ${emailNotNullOrEmptyStringCheck.reason}`
      }
    };
  }

  const hashedPasswordNotNullOrEmptyStringCheck = checks.notNullOrEmptyString(hashedPassword);
  if (!hashedPasswordNotNullOrEmptyStringCheck.valid) {
    return {
      user: null,
      error: {
        message: `hashed password invalid due to: ${hashedPasswordNotNullOrEmptyStringCheck.reason}`
      }
    };
  }

  const user = await sequelize.models.User.findOne({
    where: {
      email,
      hashedPassword
    }
  });

  return {
    user
  };
}

async function createUser(email, hashedPassword, firstName, lastName) {
  //todo add verifications
  try {
    const newUser = await sequelize.models.User.create({
      email,
      hashedPassword,
      firstName,
      lastName
    });

    await newUser.save();

    return {
      user: newUser
    }
  }
  catch (e) {
    return {
      user: null,
      error: {
        message: e.message
      }
    };
  }
}

module.exports = {
  init,
  findUsersByEmail,
  findUserByEmailAndHashedPassword,
  createUser
};