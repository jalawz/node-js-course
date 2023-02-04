const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
    });
}

exports.postAddProduct = (req, res, next) => {
    const { title, imageUrl, description, price } = req.body;
    const product = new Product(null, title, imageUrl, description, price);
    Product.create({
        title,
        price,
        imageUrl,
        description
    }).then((result) => {
        console.log('Created Product');
    }).catch((err) => {
        console.error(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    const { edit } = req.query
    if (!edit) {
        return res.redirect('/');
    }
    const { productId } = req.params;
    Product.findById(productId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/edit/add-product',
            editing: edit,
            product: product
        });
    });
}

exports.postEditProduct = (req, res, next) => {
    const { 
        productId,
        title,
        price,
        imageUrl,
        description
    } = req.body;
    const updatedProduct = new Product(productId, title, imageUrl, description, price);
    updatedProduct.save();
    res.redirect('/admin/products');
}

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products'
            });
        })
        .catch(err => console.log(err));
}

exports.postDeleteProduct = (req, res, next) => {
    const { productId } = req.body;
    Product.deleteById(productId);
    res.redirect('/admin/products');
}