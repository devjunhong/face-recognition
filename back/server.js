const express = require('express'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'junhong',
    password : '',
    database : 'face-detect'
  }
});

const register = require('./controller/register');
const signin = require('./controller/signin');
const profile = require('./controller/profile');
const image = require('./controller/image');

db.select('*').from('users').then(data => {
  console.log(data);
});

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 5000;
const database = {
  users: [
    {
      id: '123',
      name: 'Mike',
      email: 'mike@gmail.com',
      password: 'kiwi',
      entries: 0,
      join: new Date()
    },
    {
      id: '124',
      name: 'Jelly',
      email: 'jelly@gmail.com',
      password: 'kawai',
      entries: 0,
      join: new Date()
    }
  ]
}

app.get('/', (req, res) => {
  res.send(database.users);
})

app.post('/signin', signin.handleSignin(db, bcrypt))

// dependency injection
app.post('/register', (req, res) => { register.handleRegister(req, res, db, bcrypt) })

app.get('/profile/:id', (req, res) => { profile.handleProfile(req, res, db) })

app.put('/image', (req, res) => { image.handleImage(req, res, db) })
app.post('/imageurl', (req, res) => { image.handleApiCall(req, res) })

app.listen(port, () => {
  console.log(`app is listen on port ${port}...`);
})

/*
/ --->  this is working
/signin --->  POST, pass or not
/register --->  POST, registration process
/profile/:userId ---> GET, name and rank 
/image ---> PUT, update the user
*/