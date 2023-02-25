const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'
            });
        })
        .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => console.error(err));
}

exports.getProduct = (req, res, next) => {
    const { productId } = req.params;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: "/products"
            });
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    const { user } = req;
    user.getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products
            });    
        })
        .catch(err => console.error(err));
}

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    const { user } = req;
    Product.findById(productId)
        .then(product => {
            return user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
        .catch(err => console.error(err));
}

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    const { user } = req;
    user.deleteItemFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.error(err));
}

exports.postOrder = (req, res, next) => {
    const { user } = req;
    user.addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.error(err));
}

exports.getOrders = (req, res, next) => {
    const { user } = req;

    user.getOrders()
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders
            });
        })
        .catch(err => console.error(err));
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}