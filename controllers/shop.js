const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.findAll()
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
    Product.findAll()
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
    Product.findByPk(productId)
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
        .then(cart => {
            return cart.getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        path: '/cart',
                        pageTitle: 'Your Cart',
                        products: products
                    });
                })
                .catch(err => console.error(err));
        })
        .catch(err => console.error(err));
}

exports.postCart = (req, res, next) => {
    const { productId } = req.body;
    const { user } = req;
    let fetchedCart;
    let newQuantity = 1;

    user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: { id: productId }})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            }
            
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(productId);
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through: { quantity: 
                newQuantity
            }   
        });
        })
        .then(() => {
            res.redirect('/cart')
        })
        .catch(err => console.error(err));
    
}

exports.postCartDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    });
}

exports.getOrders = (req, res, next) => {
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Your Orders'
    });
}

exports.getCheckout = (req, res, next) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}