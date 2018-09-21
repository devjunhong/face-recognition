const handleSignin = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if(!email || !password){
    return res.status(400).json('incorrect submission');
  }

  db.select('email', 'hash').from('login')
    .where('email', '=', email)
    .then(data => {
      const isValid = bcrypt.compareSync(password, data[0].hash); // true
      if(isValid){
        return db.select('*').from('users').where('email', '=', email)
          .then(user => {
            res.json(user[0]);
          })
          .catch(err => res.status(400).json('unable get user'))
      }else{
        return res.json('fail to login');
      }
    })
    .catch(err => res.status(400).json('wrong credential')) ;
}

module.exports = {
  handleSignin: handleSignin
}