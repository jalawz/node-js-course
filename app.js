const path = require('path');

const express = require('express');
const mongoose = require('mongoose');

const errorController = require('./controllers/error');

const User = require('./models/user');

// Create express app
const app = express();

// Register template engines
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


// Add express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    User.findById('641778fd57d7758cc61e7221')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.error(err));
});

// Register routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb://paulo:penha269@127.0.0.1:27017', {
        dbName: 'node-complete'
    })
    .then(result => {
        console.log('Connected!')
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: 'Max',
                    email: 'max@test.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        });
        app.listen(3000);
    })
    .catch(err => console.error(err));