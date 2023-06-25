const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const passport = require('passport')
const mongoose = require('mongoose')
const session = require('express-session')

const app = express()

const users = require('./routes/users')
const stocks = require('./routes/stock')
const config = require('./config/database')

//Mongoose Connection
mongoose.connect(config.database)

mongoose.connection.on('connected', ()=>{
    console.log('Connected to database');
})

mongoose.connection.on('error', (err)=>{
    console.log('Failed to connect database' + err);
})


//Port Number
const PORT = 3000;

//CORS middleware
app.use(cors())

//Set static folder
app.use(express.static(path.join(__dirname, 'public')))

//BodyParser Middleware
app.use(bodyParser.json())

//Express Session
app.use(session({
    secret: 'your-secret-key',
    resave: true,
    saveUninitialized: true
  }));
  

//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())

require('./config/passport')(passport)

//Calling Routes
app.use('/users', users)
app.use('/stocks', stocks)
app.get('/', (req, res)=>{
    res.send('Invalid Endpoint')
})

app.get('*',(req, res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'))
} )

app.listen(PORT, ()=>{
    console.log(`Connected to port ${PORT}`);
})