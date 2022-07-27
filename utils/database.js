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
  });

  sequelize.define('Question', {
    prompt: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  sequelize.define('Answer', {
    prompt: {
      type: DataTypes.STRING,
      allowNull: false
    },
    questionId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    isCorrect: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  })
}

async function init() {
  await defineModels();

  await sequelize.sync({ force: true }); // todo remove force once table structure is well established
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

async function getQuestionsWithAnswers() {
  //* fetch all of them at once and process everything in one go to improve performance
  const questions = await sequelize.models.Question.findAll();
  const answers = await sequelize.models.Answer.findAll();

  const map = new Map();
  questions.forEach(question => {
    map.set(question.id, []);
  });

  answers.forEach(answer => {
    map.get(answer.questionId).push(answer);
  })

  return questions.map(question => ({
    question, 
    answers: map.get(question.id)
  }));
}

async function createQuestionWithAnswers(prompt, answers) {
  //todo check non nulls for everything

  //* create the question entry 
  let newQuestion = null;
  try {
    newQuestion = await sequelize.models.Question.create({
      prompt
    });

    await newQuestion.save();
  }
  catch (e) {
    return {
      error: {
        message: `Encountered ${e.message} when trying to create the question`
      }
    };
  }

  //* add the answers for this question
  let answerErrors = [];
  let newAnswers = [];
  for (let i = 0; i < answers.length; ++i) {
    const {prompt, isCorrect} = answers[i];

    // todo check for not null

    try {
      const newAnswer = await sequelize.models.Answer.create({
        questionId: newQuestion.id,
        prompt,
        isCorrect
      });

      await newAnswer.save();

      newAnswers.push(newAnswer);
    }
    catch (e) {
      answerErrors.push({
        message: `Encountered an error with answer #${index}: ${e.message}`
      });
    }
  }

  return {
    question: newQuestion,
    answers: newAnswers,
    answerErrors
  }
}

module.exports = {
  init,
  findUsersByEmail,
  findUserByEmailAndHashedPassword,
  createUser,
  createQuestionWithAnswers,
  getQuestionsWithAnswers
};