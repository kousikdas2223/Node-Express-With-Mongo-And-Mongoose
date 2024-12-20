const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
//const expressHbs = require('express-handlebars');
const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user');

const app = express();

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
const { Console } = require('console');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

 app.use((req, res, next) => {
    User.findById('6764f4026c7e06777a207928')
    .then(user => {
        req.user = new User(user.username, user.email, user.cart, user._id);
        next();
     })
    .catch(err => {
        console.log(err);
    })
});
 
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoConnect(() => {
    app.listen(3000);
});


