const path = require('path');

const express = require('express');

const errorController = require('./controllers/error');
const mongoConnect = require('./util/database');

// Create express app
const app = express();

// Register template engines
app.set('view engine', 'ejs');
app.set('views', 'views');

// const adminRoutes = require('./routes/admin');
// const shopRoutes = require('./routes/shop');


// Add express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // User.findByPk(1)
    //     .then(user => {
    //         req.user = user;
    //         next();
    //     })
    //     .catch(err => console.error(err));
})

// Register routes
// app.use('/admin', adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect((client) => {
    console.log(client);
    app.listen(3000);
});