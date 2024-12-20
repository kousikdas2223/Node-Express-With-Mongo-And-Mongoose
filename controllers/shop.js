const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-listing',
                {
                    prods: products,
                    docTitle: 'All Products',
                    path: '/products',
                });
        })
        .catch(err => {
            console.log(err);
        });
};


exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) =>
            res.render('shop/product-details',
                {
                    product: product,
                    docTitle: product.title,
                    path: '/products'
                }
            ))
        .catch(err => {
            console.log(err);
        });
};

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index',
                {
                    prods: products,
                    docTitle: 'Shop',
                    path: '/',
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                path: '/cart',
                docTitle: 'Your Cart',
                products: products
            });
        })
        .catch(err => {
            console.log(err);
        })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.deleteItemFromCart(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {
            res.render('shop/orders',
                {
                    orders: orders,
                    docTitle: 'Your Orders',
                    path: '/orders',
                });
        })
        .catch(err => {
            console.log(err);
        });
};

exports.postOrder = (req, res, next) => {
    let fetchedCart;
    req.user
        .addOrder()
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
};

exports.getCheckout = (req, res, next) => {
    const products = Product.fetchAll(products => {
        res.render('shop/checkout',
            {
                prods: products,
                docTitle: 'Checkout',
                path: '/checkout',
            });
    });
};



