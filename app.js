const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const httpStatus = require('http-status');
const config = require('./config/config');
const morgan = require('./config/morgan');
const { jwtStrategy } = require('./config/passport');
const { authLimiter } = require('./middlewares/rateLimiter');
const routes = require('./routes');
const { errorConverter, errorHandler } = require('./middlewares/error');
const ApiError = require('./utils/apiError');
const {Token} = require('./models')
const cron = require('node-cron');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session)
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {User} = require('./models')
// const generatePassword = require('./utils/generatePassword')

const app = express();

if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// cron.schedule('* * * * * *', async () => {
//   try {
//     // Supprimer les documents dont la date d'expiration est passée
//     const now = new Date();
//     const result = await Token.find({ expires: { $lte: now } });
//     if(result.length !== 0) console.log('Suppression automatique des tokens expirés effectuée.');
//   } catch (error) {
//     console.error('Erreur lors de la suppression des tokens expirés:', error);
//   }
// });

const store = new MongoDBStore({
  uri: config.mongoose.url, // Remplacez par votre URI MongoDB
  collection: 'sessions',
});

store.on('error', (error) => {
  console.error('Erreur MongoDBStore:', error);
});

app.use(session({
  store: store,
  secret: 'sydl',
  resave: true,
  saveUninitialized: true,
}));

app.use(passport.initialize());

// Configuration de Passport pour la sérialisation (utilisée lors de l'authentification)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Configuration de Passport pour la désérialisation (utilisée lors de chaque requête ultérieure)
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Configuration de Passport pour Facebook
passport.use(
  new FacebookStrategy(
    {
      clientID: '767059185196621',
      clientSecret: 'e0fe07109a7eb8aa50460e33e2a37e2f',
      // callbackURL: `http://localhost:${config.port}/auth/facebook/callback`,
      callbackURL: 'https://management-blush.vercel.app/auth/facebook/callback',
      profileFields: ['id', 'displayName', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      // Recherche de l'utilisateur dans la base de données
      let user = await User.findOne({ providerId: profile.id, provider: 'facebook' });

      if (!user) {
        // Création d'un nouvel utilisateur s'il n'existe pas déjà
        user = new User({
          // provider: 'facebook',
          // providerId: profile.id,
          nom: profile.displayName,
          email: profile.emails[0].value,
        });
        await user.save();
      }

      return done(null, user);
    }
  )
);

// Configuration de Passport pour Google
passport.use(
  new GoogleStrategy(
    {
      clientID: '117405311737-1j7luipfsjh11v0uufqsm9q63p172kje.apps.googleusercontent.com',
      clientSecret: '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',
      // callbackURL: `http://localhost:${config.port}/auth/google/callback`,
      callbackURL: 'https://management-blush.vercel.app/auth/google/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ providerId: profile.id, provider: 'google' });
        if (!user) {
          user = new User({
            // provider: 'google',
            // providerId: profile.id,
            prenom: profile.name.givenName,
            nom: profile.name.familyName,
            email: profile.emails[0].value,
            password: generatePassword(),
            isEmailVerified: profile.emails[0].verified,
            image: profile.photos[0].value,
          });
          await user.save();
        }
        return done(null, user);
      } catch (error) {
        done(error)
      }
    }
  )
);

// console.log(process.env)

// set security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options('*', cors());

// jwt authentication
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === 'production') {
  app.use('/auth', authLimiter);
}

// v1 api routes
app.use('/', routes);

app.get('/', (req, res) => {
  res.json({message: "Bienvenue sur l'API"})
})

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;