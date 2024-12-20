const mongodb = require('mongodb');
const mongoConnect = require('../util/database');
const getDb = require('../util/database').getDb;

const ObjectId = mongodb.ObjectId;
class User {
    constructor(username, email, cart, id) {
        this.username = username;
        this.email = email;
        this.cart = cart;
        this._id = id;
    }

    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    static findById(userId) {
        const db = getDb();
        return db.collection('users').
            findOne({ _id: new ObjectId(userId) })
            .then(user => {
                return user;
            })
            .catch(err => {
                console.log(err);
            });
        //find method can be used that will return 
        //a cursor and then we will have to next()
        //or else we can use findOne
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(cp => {
            console.log(cp.productId.toString());
            console.log(product._id.toString());
            return cp.productId.toString() === product._id.toString();
        });
        let newQuantity = 1;
        let updatedCartItems = [...this.cart.items];
        if (cartProductIndex >= 0) {
            newQuantity = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = newQuantity;
        }
        else {
            updatedCartItems.push({ productId: new ObjectId(product._id), quantity: newQuantity });
        }
        const updatedCart = {
            items: updatedCartItems
        }

        // const updatedCart = {items : [{productId: product._id, quantity: 1}]};
        const db = getDb();
        return db.collection('users').updateOne(
            { _id: new ObjectId(this._id) },
            { $set: { cart: updatedCart } });
    }

    getCart() {
        const db = getDb();
        console.log(this.cart.items);
        const productIds = this.cart.items.map(i => {
            return i.productId;
        });
        return db
            .collection('products')
            .find({ _id: { $in: productIds } })
            .toArray()
            .then(products => {
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    };
                });
            });
    }

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(item => {
            return item.productId.toString() !== productId.toString();
        });
        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                { _id: new ObjectId(this._id) },
                { $set: { cart: { items: updatedCartItems } } }
            );
    }

    addOrder() {
        const db = getDb();
        return this.getCart()
            .then(products => {
                const order = {
                    items: products,
                    user: {
                        _id: new ObjectId(this._id),
                        username: this.username,
                        email: this.email
                    }
                };
                return db.collection('orders')
                    .insertOne(order)
            })
            .then(result => {
                this.cart = { items: [] };
                return db.collection('users').updateOne(
                    { _id: new ObjectId(this._id) },
                    { $set: { cart: { items: [] } } }
                );
            })
            .catch(err => {
                console.log(err);
            })
    }

    getOrders() {
        const db = getDb();
        console.log(this._id);
        return db.collection('orders')
            .find({ 'user._id': new ObjectId(this._id) })
            .toArray();
    }
}

module.exports = User;
