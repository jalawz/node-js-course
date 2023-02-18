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
    const { user } = req;
    user.getCart()
        .then(cart => {
            return cart.getProducts({ where: { id: productId }})
        })
        .then(products => {
            const product = products[0];
            return product.cartItem.destroy();
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.error(err));
}

exports.postOrder = (req, res, next) => {
    const { user } = req;
    let fetchedProducts;
    let fetchedCart;
    user.getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            fetchedProducts = products;
            return user.createOrder();
        })
        .then(order => {
            return order.addProducts(fetchedProducts.map(product => {
                product.orderItem = { quantity: product.cartItem.quantity };
                return product;
            }));
        })
        .then(result => {
            return fetchedCart.setProducts(null);
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.error(err));
}

exports.getOrders = (req, res, next) => {
    const { user } = req;

    user.getOrders({ include: ['products'] })
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