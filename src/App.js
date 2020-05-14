import express from 'express';
import fs from 'fs';
import https from 'https';
import morgan from 'morgan';
import path from 'path';
import util from 'util';
import User from './models/User';

// A list of valid user IDs
const USERS = [ 'alice' ];

// The directory containing the server cert
const CERT_DIR = 'certs';

// Server and CA cert files
const SERVER_KEY = '03-server.key';
const SERVER_CERT = '03-server.pem';
const CA_CERT = 'ca.pem';

// Confirm that a certificate file exists and exit if not.
const _checkCertFile = (certFile) => {
  const f = path.join(CERT_DIR, certFile);
  if (!fs.existsSync(f)) {
    console.error(f + ' not found; cannot start HTTPS server');
    process.exit(1);
  }
};

// Looks up a client cert's CN value and matches it against the array of
// allowed users.
const _lookupUser = (cn) => {
  return USERS.includes(cn);
};

// Client cert authentication.
const _authenticate = (cert) => {
  const subject = cert.subject;
  let msg = 'Attempting MTLS authentication';

  console.log(msg + ' - cert: ' + util.inspect(cert, false, null, true));

  if (!subject) {
    console.log(msg + ' ✘ - no subject');
    return false;
  } else if (!subject.CN) {
    console.log(msg +  '✘ - no client CN');
    return false;
  } else {
    const cn = subject.CN;

    const user = _lookupUser(cn);
    const msg = 'Authenticating ' +  cn + ' with certificate';
    if (!user) {
      console.log(msg + ' ✘ - no such user');
      return false;
    } else {
      console.log(msg + ' - ✔');
      return true;
    }
  }
};

// Responds to a request with the about page.
const _sendDefaultResponse = (response) => {
  response.format({
    html: () => {
      response.status(200).render('html/about');
    }
  });
};

// Main
console.log('Starting up');

const app = express();

app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, 'public')));

// Specific user
app.get('/users/:username', (request, response) => {
  const cert = request.connection.getPeerCertificate();
  const authenticated = _authenticate(cert, response);
  if (authenticated) {
    console.log('Authenticated');
    const user = new User(request.params.username);
    response.format({
      json: () => {
        response.status(200).json(user);
      }
    });
  } else {
    console.log('Not authenticated');
    response.format({
      json: () => {
        response.status(403).json({ error: "Client cert auth failed" });
      }
    });
  }
});

// Root endpoint
app.get('/', (request, response) => {
  _sendDefaultResponse(response);
});

// Base users endpoint
app.get('/users', (request, response) => {
  _sendDefaultResponse(response);
});

console.log('Setting up TLS');
[ SERVER_CERT, SERVER_KEY, CA_CERT ].forEach(_checkCertFile);
const tlsOptions = {
  key: fs.readFileSync(path.join(CERT_DIR, SERVER_KEY)),
  cert: fs.readFileSync(path.join(CERT_DIR, SERVER_CERT)),
  requestCert: true,
  rejectUnauthorized: false,
  ca: fs.readFileSync(path.join(CERT_DIR, CA_CERT))
};
const port = process.env.PORT || 3000;

https.createServer(tlsOptions, app).listen(process.env.PORT || 3000, () => {
  console.log('Listening to port ' + port);
});

