const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.error(err));
}

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                isAuthenticated: req.session.isLoggedIn
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
                path: "/products",
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
}

exports.getCart = (req, res, next) => {
    const { user } = req;
    user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products,
                isAuthenticated: req.session.isLoggedIn
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
    user.removeFromCart(productId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.error(err));
}

exports.postOrder = (req, res, next) => {
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(item => {
                return {
                    quantity: item.quantity,
                    product: { ...item.productId._doc }
                }
            });
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user
                },
                products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.error(err));
}

exports.getOrders = (req, res, next) => {
    const { user } = req;

    Order.find({'user.userId': user._id})
        .then(orders => {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
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