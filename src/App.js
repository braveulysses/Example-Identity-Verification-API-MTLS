import express from 'express';
import morgan from 'morgan';
import path from 'path';
import User from './models/User';

const app = express();

app.set('view engine', 'pug');
app.use(morgan('dev'));
app.use('/static', express.static(path.join(__dirname, 'public')));

const _sendDefaultResponse = (response) => {
  response.format({
    html: () => {
      response.status(200).render('html/about');
    }
  });
};

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

app.get('/users', (request, response) => {
  _sendDefaultResponse(response);
});

app.listen(process.env.PORT || 3000, () => console.log("Listening to port 3000"));


