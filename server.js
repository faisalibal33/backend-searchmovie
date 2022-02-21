const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors')
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');
const api_helper = require ('./API_helper')
const request = require('request')

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : '1234',
      database : 'search-backend'
    }
});

const c = express();
c.use(bodyParser.json())
c.use(cors())

c.get('/', (req, res) => {res.send("its working")})
c.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt))

c.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt))

c.get('/profile/:id' , (req, res) => profile.handleProfile(req, res, db))

c.put ('/image', (req, res) => image.handleImage(req, res, db))

c.post ('/url', (req, res) => {
  const {search} = req.body;
  api_helper.make_API_call(`https://www.omdbapi.com/?apikey=88bf0a87&s=${search}`)
  .then(response => {
    res.json(response.Search)
  })
  .catch(error => {
    res.send(error)
  })
})

c.listen(process.env.PORT || 3000, () => {
    console.log(`running on port ${process.env.PORT}`)
});