const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
      .select('name price _id')
      .exec()
      .then(docs => {
        console.log('Handling GET Request /Products!', docs);
        const response = {
          count: docs.length,
          products: docs.map( doc => {
            return {
              name: doc.name,
              price: doc.price,
              _id: doc._id,
              request: {
                  type: 'GET',
                  URL: 'http://localhost:8000/products/'+ doc._id
              }
            }
          })
        }
        res.json(response);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
    // res.status(200).json({
    //   message: "Handling GET Request /Products!"
    // });
});

router.post("/", (req, res, next) => {
  // const product = {
  //   name: req.body.name,
  //   price: req.body.price
  // }
  const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price
  });
  product.save().then( result => {
    console.log(result);
    res.status(201).json({
      message: "Created product successfully",
      createdProduct:  {
        name: result.name,
        price: result.price,
        _id: result._id,
        request: {
            type: 'GET',
            URL: "http://localhost:8000/products/" + result._id
        }
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
  
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id)
    .select('name price _id')
    .exec()
    .then(doc => {
      console.log('From DATABASE', doc);
      if (doc){
        res.json({
          product: doc,
          request: {
            type: 'GET',
            URL: 'http://localhost:8000/products/'
          }
        });
      }else{
        res.status(404).json({
          message: 'No Valid entry Found for Provided Id'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({error: err});
    });

    // if (id === 'spacial'){
    //     res.status(200).json({
    //         message: "you discovered the special Id",
    //         id: id
    //     });
    // } else {
    //     res.status(200).json({
    //       message: "you passed an Id",
    //     });
    // }
});

router.patch("/:productId", (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body){
    updateOps[ops.propName] = ops.value;
  }
  Product.updateMany({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "Product Updated",
        request: {
          type: "GET",
          URL: "http:/localhost:8000/products/" + id
        }
      });
    })
    .catch(error => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  // res.status(200).json({
  //   message: "Updated Product!"
  // });
});

router.delete("/:productId", (req, res, next) => {
  const id = req.params.productId;
  Product.deleteMany({ _id: id })
    .exec()
    .then(result => {
      res.json({
        message: "Product Deleted",
        request: {
          type: "POST",
          URL: "http://localhost:8000/products/",
          body: { name: "String", parice: "Number" }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

  // res.status(200).json({
  //   message: "Deleted Product!"
  // });
});

module.exports = router;