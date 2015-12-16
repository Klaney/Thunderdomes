// Require our dependencies
var express = require('express');
		bodyParser = require('body-parser'),
		path = require('path'),
		expressJWT = require('express-jwt'),
		jwt = require('jsonwebtoken'),
		app = express(),
		passport = require('passport'),
		FacebookStrategy = require('passport-facebook').Strategy,
		flash = require('connect-flash'),
		http = require('http'),
		session = require('express-session'),
		mongoStore = require('connect-mongo')(session),
		Msg = require('./models/message'),
		mongoose = require('mongoose'),
		User = require('./models/user'),
		server = require('http').Server(app),
		io = require('socket.io')(3030);

// Connect to MongoDB Server
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/thunderdomes');

// Allow EJS files to be rendered correctly
app.set('view engine', 'ejs');

// Allow Flash messages to be displayed
app.use(flash());

// Store sessions on the Mongo server
app.use(session({
  secret: 'my-session-store',
  store: new mongoStore({
    url: 'mongodb://localhost/thunderdomes',
    collection : 'sessions'
  }),
  resave: true,
  saveUninitialized: true
}));

//Initialize passport and allow passport to save sessions
app.use(passport.initialize());
app.use(passport.session());

// Passport middleware to serialize user
passport.serializeUser(function(user, done) {
  done(null, user);
});
passport.deserializeUser(function(id, done) {  
    User.findOne({ _id: id }, function (err, user) {
        done(err, user);
    });
});

// Passports Facebook strategy, creating and saving a new user
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

//Set Express to use Angular in the directory
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//create an API for the users
app.use('/api/users', require('./controllers/users'));
app.use('/api/messages', require('./controllers/messages'));

//Facebook Authentication functionality
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

//Create the Auth routes within Express to login and logout
app.get('/auth/success', function(req, res) {
	console.log("WITHIN AUTH SUCCESS: "+req.user);
  res.render('after-auth', { state: 'success', user: req.user ? req.user : null });
});

app.get('/auth/failure', function(req, res) {
  res.render('after-auth', { state: 'failure', user: null });
});

app.get('/confirm-login', function (req, res) {
    res.send(req.user)
  }
);

app.delete('/auth', function(req, res) {  
  req.logout();
  res.writeHead(200);
  res.end();
});

//Set the rest of the routes to be defined within Angular
app.get('/*', function(req, res){
	res.sendFile(path.join(__dirname, 'public/index.html'));
});


// Socket.io functionality
io.on('connection', function(socket){
	io.emit('connected');
	//listens for message
	socket.on('new message', function(data){
		console.log(data);
		io.emit('message created', data)
	});
	console.log("User connected");
	socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

app.listen(process.env.PORT || 3000);