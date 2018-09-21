const Clarifai = require('clarifai');

const app = new Clarifai.App({
 apiKey: '639012d464404f3dae7d61f1fe35f9f2'
});

const handleApiCall = (req, res) => {
  return app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      req.body.input)
  .then(data => {
    res.json(data);
  })
  .catch(err => res.status(400).json('unable to work with api'))
}

const handleImage = (req, res, db) => {
  const { id } = req.body;

  db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
      res.send(entries[0]);
    })
    .catch(err => {
      res.status(400).json('unable to get entries')
    });
}

module.exports = {
  handleImage,
  handleApiCall
}