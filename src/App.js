import express from 'express';
import https from 'https';
import morgan from 'morgan';
import passport from 'passport';
import path from 'path';
import User from './models/User';

import { Strategy as ClientCertStrategy } from 'passport-client-cert';

// A list of valid user IDs
const users = [ 'alice' ];

const authOptions = {
  requestCert: true,
  rejectUnauthorized: true
};

const _authenticate = (cert, done) => {
  const subject = cert.subject;
  const msg = 'Attempting MTLS authentication';

  if (!subject) {
    console.log(msg + ' ✘ - no subject');
  }
};

const _sendDefaultResponse = (response) => {
  response.format({
    html: () => {
      response.status(200).render('html/about');
    }
  });
};


const app = express();

app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use(passport.initialize());
passport.use(new ClientCertStrategy(_authenticate));
app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/users/:username', (request, response) => {
  const user = new User(request.params.username);
  response.format({
    json: () => {
      response.status(200).json(user);
    }
  });
});

app.get('/', (request, response) => {
  _sendDefaultResponse(response);
});

app.get('/users',
    passport.authenticate('client-cert', { session: false }),
    (request, response) => {
  _sendDefaultResponse(response);
});

const port = process.env.PORT || 3000;
// app.listen(port, () => console.log('Listening to port ' + port));

https.createServer(authOptions, app).listen(process.env.PORT || 3000, () => {
  console.log("Listening to port 3000")
});

