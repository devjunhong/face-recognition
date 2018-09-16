const express = require('express'); 
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
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

app.post('/signin', (req, res) => {
  if(req.body.email === database.users[0].email &&
    req.body.password === database.users[0].password){
    // res.json('success');
    res.json(database.users[0]);
  }else{
    res.status(400).json('fail to login');
  }
})

app.post('/register', (req, res) => {
  const { email, name, password } = req.body;

  database.users.push({
      id: '125',
      name: name,
      email: email,
      password: password,
      entries: 0,
      join: new Date()
  });

  // res.send('ok wellcome');
  res.json(database.users[database.users.length - 1]);
})

app.get('/profile/:id', (req, res) => {
  const { id } = req.params; 
  const found = database.users.filter(user => user.id === id);

  if (found.length === 0){
    res.status(400).send('no such user');
  }else{
    res.json(found[0]);
  }
})

app.put('/image', (req, res) => {
  const { id } = req.body; 
  const found = database.users.filter(user => user.id === id);
  
  if (found.length === 0){
    res.status(400).send('no such user');
  }else{
    found[0].entries++;
    res.json(found[0].entries);
  }
})

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