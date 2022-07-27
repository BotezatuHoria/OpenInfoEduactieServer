# DigiWell API 

### The backend server for our digital wellbeing platform, [DigiWell](https://github.com/BotezatuHoria/OpenInfoEducatieAppplication).

<br />

## Technologies used
- Node.js v16 as the runtime environment
- Express.js for the web server
- Sequelize.js & SQLite3 for the database 
- SHA-256 for hashing the passwords

## API Endpoints

### /login & /signup
These endpoints are used to authenticate users and create new accounts.

```js
// login | signup response structure
{
  status: 'success',
  data: {
    id: 12,
    email: 'example@example.com',
    firstName: 'example',
    secondName: 'example',
    hashedPassword: 'examplesha256hash'
  }
}
```

### /questions
This endpoint accepts a GET request and returns a list of the questions for our quiz.
```js
// questions response structure
{
  questions: [
    {
      id: 12, 
      prompt: 'This is an example question',
      answers: [
        {
          questionId: 12,
          prompt: 'This is the first answer',
          isCorrect: false
        },
        {
          questionId: 12,
          prompt: 'This is the second answer',
          isCorrect: true
        }
      ]
    }
  ]
}
```

### /create-question
This is an endpoint used by admins to add a new question to the list used in the quiz.

```js
// sample question upload with axios
axios.post(`${API_URL}/create-question`, {
  prompt: 'This is my new question',
  answers: [
    {
      prompt: 'first answer',
      isCorrect: false
    },
    {
      prompt: 'second answer',
      isCorrect: true
    }
  ]
}) 

// sample response
{
  status: 'success' 
} // everything went well

{
  status: 'error',
  error: {
    message: 'This is an example error message' x
  }
} // everything went well

```
### /tracker-data
This endpoint accepts a GET request with the user id as its parameter and returns a list containing all the entries from the tracker data set corresponding to that user.
```js
//sample tracker data response
{
  status: 'success',
  data: [
    {
      id: 12,
      userId: 12,
      day: "6/27/2022",
      timeSleep: 480,
      timeEntertainment: 180,
      timeWork: 560,
      timeOutside: 150
    },
    {
      id: 13,
      userId: 12,
      day: "7/27/2022",
      timeSleep: 480,
      timeEntertainment: 180,
      timeWork: 560,
      timeOutside: 150
    }
  ]
}
```

### /add-tracker-data
This endpoint is used to add a new entry to our tracker dataset. If there's another entry by that id and day, the old one will get deleted.

```js
// sample data upload with axios
axios.post(`${API_URL}/add-tracker-data`, {
  userId: 12,
  day: "12/15/2020",
  data: {
    sleep: 480,
    work: 500,
    entertainment: 200,
    outside: 100
  }
})
```

