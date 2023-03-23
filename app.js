const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGO_DB_URI = 'mongodb://paulo:penha269@127.0.0.1:27017';
const MONGO_DB_NAME = 'node-complete';

const errorController = require('./controllers/error');

const User = require('./models/user');

// Create express app
const app = express();
const store = new MongoDBStore({
    uri: MONGO_DB_URI,
    databaseName: MONGO_DB_NAME,
    collection: 'sessions'
});

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
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user
            next();
        })
        .catch(err => console.log(err));
});

// Register routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(MONGO_DB_URI, {
        dbName: MONGO_DB_NAME
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