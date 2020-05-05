const express = require('express')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Base = require('./base');
const Acc = require('./acc');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const midl = require('./midlware');

const app = express()

mongoose.connect('mongodb://localhost:27017/myapp', { useUnifiedTopology: true, useNewUrlParser: true });
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get('/', (req, res) => {
  Base.find(({}), (err, plans) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({
        plans: plans
      })
    }
  });
});

app.get('/items/:id', (req, res) => {
  const id = req.params.id;
  Base.findById(id, (err, doc) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({
        plan: doc
      })
    }
  });
})

app.post('/new', midl, (req, res) => {
  const post = req.body;
  const object = { title: post.title, salary: post.salary, expenses: post.expenses };
  Base.create(object, (err, newObj) => {
    if (err) {
      console.log(err);
    } else {
      res.status(201).json({
        id: newObj.id
      });
    }
  });
});

app.put('/items/:id/edit', midl, (req, res) => {
  const id = req.params.id;
  const post = req.body;
  const object = { title: post.title, salary: post.salary, expenses: post.expenses };
  Base.findByIdAndUpdate(id, object, err => {
    if (err) {
      console.log(err);
    } else {
      console.log(object);
    }

  });
});
app.post('/signup', (req, res) => {
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const inf = req.body;
      const acc = { email: inf.email, password: hash }
      Acc.create(acc, (err, newAcc) => {
        if (err) {
          console.log(err);
          res.status(401).json({
            error: 'use diffrent email'
          });
        } else {
          console.log(newAcc);
          res.status(201).json({
            message: 'created acc'
          });

        }
      });
    });
});

app.post('/login', (req, res) => {
  let fetchedUser;
  Acc.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        res.status(401).json({
          err: 'there is no email'
        });
      } else {
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({
          message: 'invalid passowrd'
        });
      }
      const token = jwt.sign(
        { email: fetchedUser.email, password: fetchedUser.password },
        'test_proba_izmisljam_jer_nisam_kreativan',
        { expiresIn: '1h' }
      );

      res.status(201).json({
        token: token,
        expiresIn: 3600
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({
        message: 'failed'
      });
    });
});
app.delete('/items/:id', (req, res) => {
  const id = req.params.id;

  Base.findByIdAndDelete(id)
    .then(resp => {
      res.status(201).json({
        message: 'deleted'
      });
    })

});


app.listen(3000, () => {
  console.log('server started');
});