const express = require('express');
const session = require('express-session');
const nocache = require('nocache');
const { v4: uuidv4 } = require('uuid');
const { connectMongoDB } = require('./connection.js');
const userRouter = require('./routers/router.js');

// Instances of express 
const app = express();
const PORT = 4000;

// Middlewares 
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data
app.use(express.json()); // Parses JSON data


app.use(express.static('public')); //Serve static files

app.set('view engine', 'ejs'); //Setting the view engine

app.use(session({
    secret: 'your_static_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

// Use nocache to disable cache
app.use(nocache());
// app.use((req, res, next) => {
//     res.set('Cache-Control','no-store, nocache, must-revalidate, private');
//     next();
// });

// Routes
app.use('/', userRouter);
app.use('/users', userRouter);

//Connect database & Server
connectMongoDB('mongodb://127.0.0.1:27017/school').then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
        console.log(`Server Starts On PORT ${PORT}`);
    });
});