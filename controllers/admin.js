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
        res.redirect('/admin/products');
    }).catch((err) => {
        console.error(err);
    });
}

exports.getEditProduct = (req, res, next) => {
    const { edit } = req.query
    const { productId } = req.params;
    if (!edit) {
        return res.redirect('/');
    }
    
    Product.findByPk(productId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/edit/add-product',
                editing: edit,
                product: product
            });
        })
        .catch(err => console.log(err));
}

exports.postEditProduct = (req, res, next) => {
    const { 
        productId,
        title,
        price,
        imageUrl,
        description
    } = req.body;
    Product.findByPk(productId)
        .then(product => {
            product.title = title;
            product.price = price;
            product.imageUrl = imageUrl;
            product.description = description;
            return product.save();
        })
        .then(result => {
            console.log('UPDATE PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => console.error(err));
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
    Product.findByPk(productId)
        .then(product => {
            return product.destroy();
        })
        .then(result => {
            console.log('DESTROYED PRODUCT');
            res.redirect('/admin/products');
        })
        .catch(err => console.error(err));
}