const User = require('../models/user');
const bcrypt = require('bcrypt');
require('dotenv').config();

//Credentials
const credentials = {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
};

const adminLoginGet = (req, res) => {
    if (req.session.isAdmin) {
        return res.redirect('/admin'); // Stay in admin page if logged in
    }
    const msg = req.query.msg || '';
    res.render('adminlogin', { title: 'Admin Login', msg });
}

const adminPanelGet = (req, res) => {
    if (!req.session.isAdmin) {
        return res.redirect('/admin/login?msg=Please%20log%20in');
    }
    User.find()
        .then(users => {
            res.render('admin', { users, title: 'Admin Page', msg: '' });
        })
        .catch(error => {
            console.error(error);
            res.status(500).send('Error fetching users');
        });
}

const adminLoginPost = async (req, res) => {
    const { email, password } = req.body;
    const users = await User.find();
    if (email === credentials.email && password === credentials.password) {
        req.session.isAdmin = true;
        return res.render('admin', { users, title: "Admin Page", msg: req.body.email });
    } else {
        return res.render('adminlogin', { title: "Admin Page", msg: "Admin Login Failed....!" });
    }
}

const adminEditGet = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if(!user) {
            return res.status(404).send("User not found");
        }
        res.render('edit', { title: 'Edit User', user});
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error")
    }
}

const adminEditPost =  async (req, res) => {
    try {
        const updateUser = {
            email: req.body.email,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
        };
        await User.findByIdAndUpdate(req.params.id, updateUser);
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error updating user");
    }
}


const adminDeletePost = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error deleting user");
    }
}

const adminSearchGet = (req, res) => {
    const searchQuery = req.query.searchQuery ? req.query.searchQuery.trim() : "";
    console.log(searchQuery);

    // Update the regular expression to search for the query anywhere in the string.
    const regex = new RegExp(searchQuery, 'i'); // 'i' makes it case-insensitive.

    User.find({
        $or: [
            { firstName: { $regex: regex } },
            { lastName: { $regex: regex } },
            { email: { $regex: regex } },
        ],
    })
        .then(users => {
            return res.render('admin', { title: 'Admin Panel', msg: 'Searching the user..', users });
        })
        .catch(error => {
            console.error(error);
            res.send('Error occurred while searching');
        });
};

const adminCreateUserGet =  (req, res) => {
    const message = req.query.message || '';
    return res.render('create-user', { message });
}

const adminSaveUserPost = async (req, res) => {
    const { firstname, lastname, email, password } = req.body;

    try {
        const userAlreadyExists = await User.findOne({ email });
        if (userAlreadyExists) {
            return res.redirect('/create?message= Email already in use.');
        }

        const encryptedPassword = await bcrypt.hash(password, 10);
        const newUserData = new User({
            firstname,
            lastname,
            email,
            password: encryptedPassword,
        });

        await newUserData.save();
        return res.redirect('/admin');
    } catch (error) {
        console.error(error);
        return res.render('create-user', { message: 'Error occurred while creating the user' });
    }
}

const adminLogoutRoute = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error logging out');
        }
        res.clearCookie('connect.sid');
        res.redirect('/admin/login?msg=Logged%20out%20successfully');
    });
}

module.exports = {
    adminLoginGet,
    adminPanelGet,
    adminLoginPost,
    adminEditGet,
    adminEditPost,
    adminDeletePost,
    adminSearchGet,
    adminCreateUserGet,
    adminSaveUserPost,
    adminLogoutRoute
}



