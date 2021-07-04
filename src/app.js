const express = require('express');
const app = express();

const path = require('path');
const morgan = require('morgan');

const multer = require('multer');
const bcrypt = require('bcrypt');
const cors = require('cors');
const {connect} = require('./database');

// const Empleado = require('./models/Empleado.model');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
FacebookStrategy = require('passport-facebook').Strategy,
OutlookStrategy = require('passport-outlook').Strategy;

// NAME DOMAIN
const { LOCATION_URL_ORIGIN } = process.env;

// Models
// const User = require('./models/User.model');

// PASSPORT
const passport = require('passport'),
cookieParser = require('cookie-parser'),
session = require('express-session'),
secretCookie = process.env.SECRET_COOKIE_PARSER,
PassportLocal = require('passport-local').Strategy;

const database = require('./database')[0];
const pool = require('./database')[1];

// NAME HOST
// const os = require('os');

// const firebaseCLient = require('firebase');

// console.log('Validado');
// const formidable = require('express-formidable');

// const redis = require('redis');

// let RedisStore = require('connect-redis')(session);
// let redisClient = redis.createClient();

// settings 
app.set('port', process.env.PORT || 3001);
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');

app.use(morgan('dev'));
// app.use(database);
app.use(cors({origin: '*'}));
app.use(express.urlencoded({extended: true}));

// client.on('connect', function() {
//   console.log('Conectado a Redis Server');
// });
// store: new RedisStore({host: 'localhost', port: 6379, client: client}),
// PASSPORT CONFIG
app.use(cookieParser(secretCookie));
const sessionMiddleware = session({
  secret: secretCookie,
  resave: true,
  saveUninitialized: true
})
app.use(sessionMiddleware);

app.use(passport.initialize());
app.use(passport.session());

// PASSPORT USER STABLISHED WITH PASSPORTLOCAL
passport.use(new PassportLocal(async function(username, password, done) {
  let retorno = true;
  let codUser = 0;
  let nomUser = "";
  let celUser = "";
  let emailUser = "";
  let cargoUser = "";
  //usernameGlobal.length = 0;
  const connection = await connect();
  const [rows] = await connection.query(`SELECT emp.*, c.nombre as cargo FROM empleados emp INNER JOIN cargo c ON emp.cod_cargo = c.codigo WHERE emp.usuario = '${username}' AND emp.pass = '${password}'`);
  if(rows.length > 0) {
    retorno = false;
    codUser = rows[0].codigo;
    nomUser = rows[0].nombres + ' ' + rows[0].apellidos;
    celUser = rows[0].telefono;
    emailUser = rows[0].correo;
    cargoUser = rows[0].cod_cargo;
    imagen = rows[0].imagen;
  }
  if(!retorno) {
    return done(null, { codigo: codUser, user: username, name: nomUser, celular: celUser, email: emailUser, cargo: cargoUser, imagen});
   } 
  done(null, false);
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: `${LOCATION_URL_ORIGIN}/google/callback`
},
function(accessToken, refreshToken, profile, done) {
    return done(null, {
      id: profile.id,
      user: profile.emails[0].value,
      name: profile.displayName,
      foto: profile.photos[0].value
    });
}
));

passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID,
  clientSecret: process.env.FACEBOOK_APP_SECRET,
  callbackURL: `${LOCATION_URL_ORIGIN}/facebook/callback`,
  profileFields: ['id', 'email', 'displayName', 'photos']
},
function(accessToken, refreshToken, profile, done) {
  return done(null, {
    id: profile.id,
    user: profile.emails[0].value,
    name: profile.displayName,
    foto: profile.photos[0].value
  });
}
));

passport.use(new OutlookStrategy({
    clientID: process.env.OUTLOOK_CLIENT_ID,
    clientSecret: process.env.OUTLOOK_CLIENT_SECRET,
    callbackURL: `${LOCATION_URL_ORIGIN}/outlook/callback`,
  },
  function(accessToken, refreshToken, profile, done) {
    // console.log(profile);
    return done(null, {
      id: profile.id.split('@')[1],
      user: profile.emails[0].value,
      name: profile.displayName,
      foto: 'https://yt3.ggpht.com/yti/ANoDKi56hUd0nUHBuxBHFhSaAPRGkufNNSNGi9TDYQ=s108-c-k-c0x00ffffff-no-rj'
  } );
  //'/img/avatar-login3.png'
  
    // return done(null, profile);
    // var user = {
    //   outlookId: profile.id,
    //   name: profile.DisplayName,
    //   email: profile.EmailAddress,
    //   accessToken: accessToken
    // };
    // if (refreshToken)
    //   user.refreshToken = refreshToken;
    // if (profile.MailboxGuid)
    //   user.mailboxGuid = profile.MailboxGuid;
    // if (profile.Alias)
    //   user.alias = profile.Alias;
    // User.findOrCreate(user, function (err, user) {
    //   return done(err, user);
    // });
  }
));

// SERIALIZAR USER
passport.serializeUser(function(user, done) {
  done(null, user);
});

// DESERIALIZAR USER
passport.deserializeUser(function(user, done) {
  done(null, user);
});


// static files
app.use(express.static(path.join(__dirname, 'public')));

/*app.use(express.json());
app.use(express.urlencoded({ extended: false }));*/

// Middlewares
// app.use(multer({
//   dest: path.join(__dirname, "public/upload")
// }).single('imageUser'));


app.use(multer({
  dest: path.join(__dirname, "public/upload"),
  limits: { fieldSize: 202600000 }
}).single('archivo'));

// routes
app.use(require('./routes/index').router);   

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({
    msg: 'Page not found'
  })
});

// starting the server
module.exports = {app, sessionMiddleware};