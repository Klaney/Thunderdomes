var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var flash = require('connect-flash');
var http = require('http');
var session = require('express-session');
var mongoStore = require('connect-mongo')(session);

var mongoose = require('mongoose');
var User = require('./models/user');
mongoose.connect('mongodb://localhost/thunderdomes');

app.set('view engine', 'ejs');

app.use(flash());
// app.use(session({ secret: 'keyboard cat', cookie: { maxAge: 60000 }}));

app.use(session({
  secret: 'my-session-store',
  store: new mongoStore({
    url: 'mongodb://localhost/thunderdomes',
    collection : 'sessions'
  })
}));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {  
    User.findOne({ _id: id }, function (err, user) {
        done(err, user);
    });
});

passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "http://localhost:3000/callback/facebook",
    profileFields: ['email', 'displayName', 'picture'],
    enableProof: false
  },function(accessToken, refreshToken, profile, done) {
	  User.findOne({ 'facebook.id': profile.id }, function (err, user) {
	    if (err) { return done(err); }
	    if (!user) {
	      user = new User({
	        name: profile.displayName,
	        user_image: profile.picture,
	        username: profile.username,
	        provider_id: profile.id,
	        provider: 'facebook',
	        facebook: profile._json
	      });
	      user.save(function (err) {
	        if (err) {
	            console.log(err);
	        }
	        return done(err, user);
	      });
	    } else {
	      return done(err, user);
	    }
	  })
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/api/users', require('./controllers/users'));

app.get('/auth/facebook',
  passport.authenticate('facebook'),
  function(req, res){}
);

app.get('/callback/facebook', function(req, res) {
  passport.authenticate('facebook', function(err, user, info) {
    if (err) throw err;
    if (user) {
      req.login(user, function(err) {
        if (err) throw err;
        req.flash('success', 'You are now logged in with ' + req.params.provider);
        res.redirect('/auth/success');
      });
    } else {
      req.flash('danger', 'Error');
      res.redirect('/auth/failure');
    }
  })(req, res);
});

app.get('/auth/success', function(req, res) {
	console.log("WITHIN AUTH SUCCESS: "+req.user);
  res.render('after-auth', { state: 'success', user: req.user ? req.user : null });
});

app.get('/auth/failure', function(req, res) {
  res.render('after-auth', { state: 'failure', user: null });
});

app.delete('/auth', function(req, res) {  
  req.logout();
  res.writeHead(200);
  res.end();
});

app.get('/*', function(req, res){
	console.log(req.user);
	res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(process.env.PORT ||3000);