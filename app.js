const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
//const expressHbs = require('express-handlebars');
const errorController = require('./controllers/error')
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const mongodbUri = 'mongodb+srv://daskousik2223:dk338142@cluster0.jxx4h.mongodb.net/shop';
const app = express();

const store = new MongoDBStore({
    uri: mongodbUri,
    collection: 'sessions'
});

//using ejs
app.set('view engine', 'ejs');
app.set('views', 'views');

//using express handlebars
//app.engine('handlebars',expressHbs({layoutsDir: 'views/layouts/', defaultLayout: 'main-layout'}));
//app.set('view engine', 'handlebars');
//app.set('views', 'views');

//using pug
//app.set('view engine', 'pug');
//app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const { Console } = require('console');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session(
    {
        secret: 'my secret',  //In actual scenario this is long string
        resave: false,
        saveUninitialized: false,
        store: store
    }));

app.use((req, res, next) => {

    if (!req.session.user) {
        return next();
    }
    console.log(req.session.user._id);
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect(mongodbUri)
    .then(result => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    userName: 'Kousik Das',
                    email: 'das.kousik2223@gmail.com',
                    cart: {
                        items: []
                    }
                });
                user.save();
            }
        })
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });


