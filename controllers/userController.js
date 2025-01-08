const User = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();


const loginPage = async (req, res) => {
    res.redirect('/users/login');
}

const userSignUpPost = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render('SignUp', { title: 'Sign Up Page', msg: 'Email already in use.'});
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
        firstname,
        lastname,
        email,
        password: hashedPassword,
    });
    await user.save();
    console.log(user);
    res.redirect('/users');
 } catch (error) {
    console.log(error);
    res.status(500).send('Error saving user');
 }
}

const userLoginPost = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            req.session.userId = user._id;
            return res.redirect('/home');
        } else {
            return res.redirect("/users/login?msg=Invalid%20email%20or%20password.");
        }
    } catch (error) {
        console.log(error);
        res.status(500).send("Error logging in");
    }
}

const userLoginGet = (req, res) => {
    const msg = req.query.msg || '';
    if (req.session.userId) {
        return res.redirect("/home");
    }
    res.render('login', { title: "Login Page", msg });
}

const userSignUpGet = (req, res) => {
    if(req.session.userId) {
        return res.redirect('/home');
    }
    res.render('SignUp', { title: "Sign Up Page", msg: ''});
}

const userHomeGet = async (req, res) => {
    if(!req.session.userId && !req.session.isAdmin) {
        return res.redirect('/users');
    }
    try {
        const user = await User.findById(req.session.userId);
        const msg = user ? `Welcome ${user.firstname}` : '';
        return res.render('home', { title: 'Home Page', msg });
    } catch (error) {
        console.log(error);
        return res.status(500).send('Error');
    }
}


const logoutRoute = (req, res) => {
    req.session.destroy((err) => {
        if(err) {
            console.log(err);
            return res.status(500).send("Error logging out");
        }
        res.clearCookie('connect.sid'); // Clear session cookie
        res.redirect("/users/login?msg=Logged%20out%20successfully");
    });
}



module.exports = {
    loginPage,
    userSignUpPost,
    userLoginPost,
    userLoginGet,
    userSignUpGet,
    userHomeGet,
    logoutRoute
}