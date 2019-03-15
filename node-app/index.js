const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')


const app = express()

//引入users.js  profiles.js
const users = require('./routes/api/users')
const profiles = require('./routes/api/profiles')
const posts = require('./routes/api/posts')


// DB config
const db = require('./config/keys').mongoURL

//passport  初始化
app.use(passport.initialize());
require('./config/passport')(passport)

//使用中间件实现允许跨域
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Content-Type")
    res.header("Access-Control-Allow-Methods", "PUT, POST, DELETE, GET, OPTIONS")
    next()
})

//使用bodyParser中间件
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//connect to mongodb
mongoose.connect(db)
        .then(() => console.log("MongoDB is Connected"))
        .catch(err => console.log(err))



//使用routes
app.use('/api/users', users)
app.use('/api/profiles', profiles)
app.use('/api/posts', posts)


app.get('/', (res, req) => {
    res.json({msg: "Hello World"})
})

const port = process.env.PROT || 5000

app.listen(port, () => {
    console.log(`server is running by port ${port}`)
})