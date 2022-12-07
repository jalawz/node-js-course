const path = require('path');

const express = require('express');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Create express app
const app = express();

// Register template engines
//app.engine('hbs', expressHbs.engine());
//app.set('view engine', 'hbs');
//app.set('view engine', 'pug');
app.set('view engine', 'ejs');
app.set('views', 'views');

// Add express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Register routes
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found'
    });
});


app.listen(3000);