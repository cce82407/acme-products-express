const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');
const uuid = require('uuid');

app.use(express.json());

app.get('/products', (req, res, next)=> {
  db.readJSON('./products.json')
    .then( products => res.send(products))
    .catch(next);
});

app.delete('/products/:id', (req, res, next)=> {
  db.readJSON('./products.json')
    .then( products => {
      const updated = products.filter( product => product.id !== req.params.id);
      return db.writeJSON('./products.json', updated);
    })
    .then(()=> res.sendStatus(204))
    .catch( ex => next(ex));
});

app.post('/products', (req, res, next)=> {
  let product;
  console.log(req.body)
  db.readJSON('./products.json')
    .then( products => {
      product = {...req.body};
      product.id = uuid.v4();
      return db.writeJSON('./products.json', [product, ...products]);
    })
    .then(()=> res.status(201).send(product))
    .catch( ex => next(ex));
});

app.get('/', (req, res, next)=> {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const port = process.env.PORT || 3000;

app.listen(port, ()=> console.log(`listening on port ${port}`));
