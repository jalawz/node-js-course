const path = require('path');

const express = require('express');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

// Create express app
const app = express();

// Add express middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Register routes
app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});


app.listen(3000);