const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Product = require('../models/product');

router.get('/', (req, res, next) => {
    Product.find()
      .exec()
      .then(docs => {
        console.log('Handling GET Request /Products!', docs);
        res.json(docs);
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
      message: "Handling POST Request /Products!",
      createdProduct: result
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({ error: err });
  });
  
});

router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;

    Product.findById(id).exec()
    .then(doc => {
      console.log('From DATABASE', doc);
      if (doc){
        res.status(200).json(doc);
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
  Product.update({ _id: id }, { $set: updateOps})
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json(result)
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
  Product.remove({ _id: id})
  .exec()
  .then(result => {
    res.status(200).json(result);
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