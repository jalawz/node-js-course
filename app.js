const path = require('path');

const express = require('express');

const errorController = require('./controllers/error');
const sequelize = require('./util/database');

// Create express app
const app = express();

// Register template engines
app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Add express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Register routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

sequelize.sync()
    .then(result => {
        //console.log(result);
        app.listen(3000);
    })
    .catch(err => console.log(err));
